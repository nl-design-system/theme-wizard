import { IconSearch } from '@tabler/icons-react';
import { FormFieldTextbox } from '@utrecht/component-library-react';
import React, { type FormEvent, useState } from 'react';
import './styles.css';

export interface SearchFormProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: (query: string) => void;
  placeholder?: string;
  label?: string;
}

export const SearchForm = ({
  label = 'Zoek binnen Gemeente Voorbeeld',
  onQueryChange,
  onSubmit,
  query,
}: SearchFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError('U moet een zoekterm invoeren voordat u zoekt.');
      return;
    }

    setError(null);
    onSubmit(trimmedQuery);
  };

  return (
    <section aria-labelledby="search-form-heading" className="clippy--search-form-section">
      <h2 id="search-form-heading" className="ams-visually-hidden">
        Zoekformulier
      </h2>

      <form onSubmit={handleSubmit} className="clippy--search-form" noValidate method="GET">
        <div className="clippy--search-form__field">
          <search>
            {error && (
              <p id="search-error" role="alert" className="search-form__error" aria-live="polite">
                {error}
              </p>
            )}

            <div className="clippy--search-form__input-group">
              <FormFieldTextbox
                value={query}
                onChange={(e) => onQueryChange((e.target as HTMLInputElement).value)}
                aria-required
                id="search-query"
                type="search"
                aria-description="Search results will appear below"
                autoComplete="off"
                required
                aria-invalid={Boolean(error)}
                name="search"
                placeholder="Zoeken"
                label={label}
                className="clippy--visually-hidden"
              />

              <button type="submit" className="nl-button nl-button--primary nl-button--icon-only" title="Zoeken">
                <IconSearch size={20} />
              </button>
            </div>
          </search>
        </div>
      </form>
    </section>
  );
};
