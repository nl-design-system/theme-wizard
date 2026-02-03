import { FormLabel } from '@utrecht/component-library-react/dist/css-module';
import { IconSearch } from '@tabler/icons-react';
import { Icon, FormFieldTextbox } from '@utrecht/component-library-react';
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
  placeholder = 'Zoeken',
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

      <form onSubmit={handleSubmit} className="search-form" noValidate method="GET">
        <div className="search-form__field">
          <search>
          {error && (
            <p id="search-error" role="alert" className="search-form__error" aria-live="polite">
              {error}
            </p>
          )}

          <div className="search-form__input-group">
            <FormFieldTextbox value={query} onChange={(e) => onQueryChange(e.target.value)} aria-required id="search-query" type="search" aria-description='Search results will appear below' autoComplete='off' required aria-invalid={Boolean(error)} name="trefwoord" placeholder="Zoeken" label={label} className='clippy--visually-hidden'/>

            <clippy-button icon-only type="submit" class="search-form__submit" title="start-zoeken">
              <Icon slot="iconStart">
                <IconSearch />
              </Icon>
            </clippy-button>
          </div>
          </search>
        </div>
      </form>
    </section>
  );
};
