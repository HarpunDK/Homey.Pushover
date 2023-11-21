import { FlowCardAction } from 'homey';
import { AutocompleteItemType } from '../Domain/AutocompleteItemType';

export class HomeyAutocompleteHelper {

    static RegisterAutocomplete(card: FlowCardAction, argumentName: string, AutocompleteItemCollection: Array<AutocompleteItemType>) {
        card.registerArgumentAutocompleteListener(argumentName, async (query, args) => {
            
            // filter based on the query
            return AutocompleteItemCollection.filter((result) => {
              return result.name.toLowerCase().includes(query.toLowerCase());
            });
            
          });
    }

}