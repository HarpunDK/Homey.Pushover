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

    static ResolveSoundCollection(soundCollectionResponse:any) : AutocompleteItemType[] {
        
        var soundsElement = soundCollectionResponse.sounds;

        var soundCollection = _.chain(soundsElement)
                                .allKeys()
                                .map(key => new AutocompleteItemType(key, soundsElement[key]))
                                .sortBy(sound => sound.name)
                                .value()
                                ;
        //console.log("MY SOUNDS", soundCollection);

        return soundCollection;
    }

    static GetPriorityCollection() : Array<AutocompleteItemType>{
        return new Array<AutocompleteItemType>(
            new AutocompleteItemType("-2", "Lowest Priority"),
            new AutocompleteItemType("-1", "Low Priority"),
            new AutocompleteItemType( "0", "Normal Priority"),
            new AutocompleteItemType( "1", "High Priority"),
            new AutocompleteItemType( "2", "Emergency Priority"),
        );
    }

    static ResolveDeviceCollection(deviceCollection:string) : Array<AutocompleteItemType> {
        //console.log("###", "deviceCollection", deviceCollection);
        return _.map(deviceCollection.split(";"), (device: string) => {
            var deviceWithAlias = device.split(":", 2);
            
            if (Array.isArray(deviceWithAlias) && deviceWithAlias.length === 2) {  // device-part contains alias - due to the use of ':'
                return {
                    name:   deviceWithAlias[0],
                    id:     deviceWithAlias[1]
                };
            }

            return {
              name: device,
              id: device
            };
        });
    }

    static ResolveGroupCollection(groupCollection:string) : Array<AutocompleteItemType> {
        if (groupCollection.length === 0) // On empty, resturn empty
            return [];
        
        //console.log("###", "deviceCollection", deviceCollection);
        return _.map(groupCollection.split(";"), (group: string) => {
            var groupWithAlias = group.split(":", 2);
            
            if (Array.isArray(groupWithAlias) && groupWithAlias.length === 2) {  // device-part contains alias - due to the use of ':'
                return {
                    name: groupWithAlias[0],
                    id: `G#${groupWithAlias[1]}`
                };
            }

            return {
              name: group,
              id: `G#${group}`
            };
        });
    }

    
}