import { resolveUrl, type ScrapedDesignToken } from '@nl-design-system-community/css-scraper';
import { type TemplateResult } from 'lit';
import { assign, fromPromise, raise, setup } from 'xstate';
import { t } from '../../i18n';
import Scraper from '../../lib/Scraper';

export const scraperMachine = setup({
  actions: {
    assignUrl: assign({
      resolvedUrl: ({ event }) => {
        if (event.type === 'SUBMIT') {
          const resolvedUrl = resolveUrl(event.url);
          return resolvedUrl ?? null;
        }
        return null;
      },
      url: ({ event }) => (event.type === 'SUBMIT' ? event.url : null),
    }),
  },
  actors: {
    scrapeTokens: fromPromise<ScrapedDesignToken[], { scraper: Scraper; url: URL }>(({ input }) =>
      input.scraper.getTokens(input.url),
    ),
  },
  guards: {
    isValidUrl: ({ event }) => event.type === 'SUBMIT' && Boolean(resolveUrl(event.url)),
  },
  types: {
    context: {} as {
      error: string | TemplateResult;
      result: ScrapedDesignToken[];
      scraper: Scraper;
      url: string | null;
      resolvedUrl: URL | null;
    },
    events: {} as { type: 'SUBMIT'; url: string } | { type: 'TASK_RESOLVED' },
    input: {} as { scraper: Scraper },
  },
}).createMachine({
  id: 'scraper-form',
  context: ({ input }) => ({
    error: '',
    resolvedUrl: null,
    result: [],
    scraper: input.scraper,
    url: null,
  }),
  initial: 'idle',

  states: {
    done: {},

    error: {
      on: {
        SUBMIT: [
          {
            actions: 'assignUrl',
            guard: 'isValidUrl',
            target: 'loading',
          },
          {
            actions: assign({ error: () => t('scraper.invalidUrl') }),
          },
        ],
      },
    },

    idle: {
      on: {
        SUBMIT: [
          {
            actions: 'assignUrl',
            guard: 'isValidUrl',
            target: 'loading',
          },
          {
            actions: assign({ error: () => t('scraper.invalidUrl') }),
            target: 'error',
          },
        ],
      },
    },

    loading: {
      invoke: {
        // url is guaranteed non-null here: SUBMIT always sets it before entering loading.
        input: ({ context }) => ({ scraper: context.scraper, url: context.resolvedUrl as URL }),
        onDone: {
          // No target — stay in the parallel regions; just record the result
          // and raise an internal event so the `task` region can finalize.
          actions: [assign({ result: ({ event }) => event.output }), raise({ type: 'TASK_RESOLVED' })],
        },
        onError: {
          // Exit immediately regardless of where the timer is.
          actions: assign({ error: ({ context }) => t('scraper.scrapeFailed', { url: context.url }) }),
          target: 'error',
        },
        src: 'scrapeTokens',
      },

      // Fires when task.resolved AND timer.timerDone are both reached.
      onDone: 'done',

      // Both regions must reach their final state before `loading.onDone`
      // fires — this enforces the minimum 3 + 3 = 6 second display time
      // while also waiting for slow async tasks.
      states: {
        // Tracks async task completion.
        task: {
          initial: 'pending',
          states: {
            pending: {
              on: { TASK_RESOLVED: 'resolved' },
            },
            resolved: { type: 'final' },
          },
        },

        // Drives the visual loading steps.
        timer: {
          initial: 'loader1',
          states: {
            loader1: { after: { 3000: 'loader2' } },
            loader2: { after: { 3000: 'timerDone' } },
            timerDone: { type: 'final' },
          },
        },
      },

      type: 'parallel',
    },
  },
});

export type ScraperMachine = typeof scraperMachine;
