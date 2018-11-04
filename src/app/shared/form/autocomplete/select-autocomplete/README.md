### Description

This component extends the `mat-autocomplete` one and makes it possible to force a selection 
from the list of options.

### Options

| Option | Description |
| ---- | ---- |  
| `placeholder` | Input placeholder |
| `width` | Input field width |
| `panelWidth` | Autocomplete Panel Width|
| `autoActiveFirstOption` | Activate first option from the list |
| `notFoundMessage` | The message to display when the entered option has not been found in the list |
| `forceSelection` | Force a selection from the list |
| `dataSource` | The data source from which we'll retrieve/search the options |
| `searchControl` | A `FormControl` field which will be used to subscribe for `valueChanges` |
| `dependsOn` | An `AbstractControl` reference to another field, which needs to be `valid` before this one will become enabled |
| `displayWith` | Callback function which returns the string to be displayed upon option selection |

### Examples

* Example 1

      template.ts
      this.storageField = new FormControl()
      this.storageSearchDataSource = new DefaultAutocompleteDataSource(null, this.storageAutocompleteService, true);
      
      template.service.ts
      storageAutocompleteService = (search: string): Observable<AutocompleteOption[]> => {
          return this
              .formDataService
              .findStorages(search)
              .pipe(map((a: string[]) => a.map(v => new AutocompleteOption(v, v))));
      };
    
      template.html
      <select-autocomplete
              placeholder="Storage"
              [searchControl]="storageField"
              [dataSource]="storageSearchDataSource"
              [forceSelection]="true"
              width="100%">
      </select-autocomplete>
      
      
* Example 2 (with dependency)

      template.ts
      this.storageField = new FormControl()
      this.repositoryField = new FormControl()
      this.storageSearchDataSource = new DefaultAutocompleteDataSource(null, this.storageAutocompleteService, true);
      this.repositorySearchDataSource = new DefaultAutocompleteDataSource(null, this.repositoryAutocompleteService, true);
      
      template.service.ts
      storageAutocompleteService = (search: string): Observable<AutocompleteOption[]> => {
          return this
              .formDataService
              .findStorages(search)
              .pipe(map((a: string[]) => a.map(v => new AutocompleteOption(v, v))));
      };
      repositoryAutocompleteService = (search: string): Observable<AutocompleteOption[]> => {
          return this
              .formDataService
              .findRepositoriesByStorage(this.storageField.value, search)
              .pipe(
                  map((a: string[]) => a.map(v => new AutocompleteOption(v, v)))
              );
      };
    
      template.html
      <select-autocomplete
              placeholder="Storage"
              [searchControl]="storageField"
              [dataSource]="storageSearchDataSource"
              [forceSelection]="true"
              width="100%">
      </select-autocomplete>
      
      <select-autocomplete
              placeholder="Repository"
              [searchControl]="repositoryField"
              [dataSource]="repositorySearchDataSource"
              [forceSelection]="true"
              [dependsOn]="storageField"
              width="100%"
      >
      </select-autocomplete>
