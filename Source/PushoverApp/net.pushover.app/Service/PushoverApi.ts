import axios from 'axios';
import { SimpleClass } from 'homey';
import { PushoverHelper } from './PushoverHelper';
import { ManagerSettings } from 'homey/lib/Homey';

export class PushoverApi {

    constructor(public HomeyManagerSettings: ManagerSettings, public PushoverToken: string, public PushoverUserKey: string, public BaseClass: SimpleClass) {

    }

    public SendMessage = async (body: any) => {

        // Push values into body
        body.token = this.PushoverToken;
        body.user  = body.group ?? this.PushoverUserKey; // If group are supplied, group > user 

        // Handle global emergency rule
        if (body.priority == "2") {
            body.retry  =  5 * 60;
            body.expire = 20 * 60;
        }

        //this.BaseClass.log("sending message", "==>", body);

        axios.post("https://api.pushover.net/1/messages.json", body)
            .then((response) => {
                this.BaseClass.log("Command send", response.data);

                var rateLimit = response.headers['x-limit-app-remaining'];
                
                // Refresh ratelimit - update key: PushoverRateLimit
                this.HomeyManagerSettings.set("PushoverRateLimit", rateLimit); 
            })
            .catch((error) => {
                this.BaseClass.log("ERROR", error);
                throw error; // Bubble up.
            })
            .finally(() => {
                // always executed
            });
    }

    public GetSoundCollection = async () : Promise<any> => {
        var token = this.PushoverToken;
        
        if ((token || '').length === 0){
            this.BaseClass.log("Token null or empty - cannot get sound-collection");
            return PushoverHelper.GetSoundCollection();
        }

        var response = await axios.get(`https://api.pushover.net/1/sounds.json?token=${token}`).then();
        return response.data;
    }


    public ThrowErrorOnEmptyToken = () => {
        if ((this.PushoverToken || '').length === 0)
            throw Error("Operation failed. Missing Token detected. Visit App-settings to set Token. Breaking bad.");
    }

}