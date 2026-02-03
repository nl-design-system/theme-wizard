import { FormLabel } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC, type FormEvent, useState } from 'react';

export interface SearchFormProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: (query: string) => void;
  placeholder?: string;
  label?: string;
}

export const SearchForm: FC<SearchFormProps> = ({
  label = 'Zoek binnen Gemeente Voorbeeld',
  onQueryChange,
  onSubmit,
  placeholder = 'Bijvoorbeeld: afval, paspoort, verhuizing',
  query,
}) => {
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
    <section aria-labelledby="search-form-heading" className="search-form-section">
      <h2 id="search-form-heading" className="ams-visually-hidden">
        Zoekformulier
      </h2>

      <form onSubmit={handleSubmit} className="search-form" role="search" noValidate>
        <div className="search-form__field">
          <FormLabel htmlFor="search-query">
            {label}
            <span className="ams-visually-hidden"> (verplicht veld)</span>
          </FormLabel>

          {error && (
            <p id="search-error" role="alert" className="search-form__error" aria-live="polite">
              {error}
            </p>
          )}

          <div className="search-form__input-group">
            <input
              id="search-query"
              name="trefwoord"
              type="search"
              className="utrecht-textbox utrecht-textbox--html-input search-form__input"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={placeholder}
              aria-required="true"
              aria-describedby={error ? 'search-error' : undefined}
              required
              autoComplete="off"
              aria-invalid={Boolean(error)}
            />

            <clippy-button type="submit" class="search-form__submit" aria-label="Zoeken uitvoeren">
              Zoek
            </clippy-button>
          </div>
        </div>
      </form>
    </section>
  );
};
