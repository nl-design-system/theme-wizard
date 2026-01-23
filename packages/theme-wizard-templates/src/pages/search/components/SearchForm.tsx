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
    <section aria-label="Zoekformulier" className="search-form-section">
      <form onSubmit={handleSubmit} className="search-form" noValidate>
        <div role="search" className="search-form__field">
          <FormLabel htmlFor="search-query" className="utrecht-visually-hidden">
            {label}
            <span className="utrecht-visually-hidden"> (verplicht veld)</span>
            <span aria-hidden="true">*</span>
          </FormLabel>

          {error && (
            <p id="search-error" role="alert" className="search-form__error">
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
              required
              autoComplete="off"
              aria-invalid={Boolean(error)}
            />

            <clippy-button type="submit" class="search-form__submit">
              Zoek
            </clippy-button>
          </div>
        </div>
      </form>
    </section>
  );
};
