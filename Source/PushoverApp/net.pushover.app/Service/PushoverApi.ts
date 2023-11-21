import axios from 'axios';
import { SimpleClass } from 'homey';

export class PushoverApi {

    constructor(public PushoverToken: string, public PushoverUserKey: string, public BaseClass: SimpleClass) {

    }

    public SendMessage = async (body: any) => {

        // Push values into body
        body.token = this.PushoverToken;
        body.user = this.PushoverUserKey;

        axios.post("https://api.pushover.net/1/messages.json", body)
            .then((response) => {
                this.BaseClass.log("Command send", response.data);
            })
            .catch((error) => {
                this.BaseClass.log("ERROR", error);
                throw error; // Bubble up.
            })
            .finally(() => {
                // always executed
            });

    }

}