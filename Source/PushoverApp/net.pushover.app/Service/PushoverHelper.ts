import { AutocompleteItemType } from "../Domain/AutocompleteItemType";

import _ from 'underscore';

export class PushoverHelper {

    static GetSoundCollection() : AutocompleteItemType[] {
        return new Array<AutocompleteItemType>(
            new AutocompleteItemType("pushover", "Pushover (default)"),
            new AutocompleteItemType("bike", "Bike"),
            new AutocompleteItemType("bugle", "Bugle"),
            new AutocompleteItemType("cashregister", "Cashregister"),
            new AutocompleteItemType("cosmic", "Cosmic"),
            new AutocompleteItemType("falling", "Falling"),  
            new AutocompleteItemType("gamelan", "Gamelan"),
            new AutocompleteItemType("incoming", "Incoming"),  
            new AutocompleteItemType("intermission", "Intermission"),
            new AutocompleteItemType("magic", "Magic"),
            new AutocompleteItemType("mechanical", "Mechanical"),
            new AutocompleteItemType("pianobar", "Piano Bar"),
            new AutocompleteItemType("siren", "Siren"),
            new AutocompleteItemType("spacealarm", "Space Alarm"),
            new AutocompleteItemType("tugboat", "Tug Boat"),
            new AutocompleteItemType("alien", "Alien Alarm (long)"),
            new AutocompleteItemType("climb", "Climb (long)"),
            new AutocompleteItemType("persistent", "Persistent (long)"),
            new AutocompleteItemType("echo", "Pushover Echo (long)"),
            new AutocompleteItemType("updown", "Up Down (long)"),
            new AutocompleteItemType("vibrate", "Vibrate Only"),
            new AutocompleteItemType("none", "None (silent)")
        );
    }

    static GetPriorityCollection() : Array<AutocompleteItemType>{
        return new Array<AutocompleteItemType>(
            new AutocompleteItemType("-2", "Lowest Priority"),
            new AutocompleteItemType("-1", "Low Priority"),
            new AutocompleteItemType( "0", "Normal Priority"),
            new AutocompleteItemType( "1", "High Priority"),
            //new AutocompleteItemType( "2", "Emergency Priority"),
        );
    }

    static ResolveDeviceCollection(deviceCollection:string) : Array<AutocompleteItemType> {
        
        return _.map(deviceCollection.split(";"), (device: string) => {
            return {
              name: device,
              id: device
            };
        });
    }
}