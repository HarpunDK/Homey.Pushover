import Homey from 'homey';
import axios from 'axios';
import _ from 'underscore';

class MyApp extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('MyApp has been initialized');

    // Image support
    const snapshot = await this.homey.images.createImage();
    // create a token & register it
    const snapshotToken = await this.homey.flow.createToken("snapshot_token", {
      type: "image",
      title: "snapshot",
      value: null
    });
    snapshotToken.setValue(snapshot);

    //#region  [ send-notification ]
    const card = this.homey.flow.getActionCard("send-notification");
    

    card.registerArgumentAutocompleteListener("device", async (query, args) => {
      
      var pushoverDevices = this.homey.settings.get("PushoverDevices");
      
      const deviceCollection = _.map(pushoverDevices.split(";"), (device: string) => {
        return {
          "name": device,
          "id": device
        };
      });
      
      // filter based on the query
      return deviceCollection.filter((result) => {
        return result.name.toLowerCase().includes(query.toLowerCase());
      });
      
    });
    
    card.registerRunListener(async (args) => {
      var title = args.title;
      var message = args.message;
      var device = args.device.id;
      
      // Arrange: settings
      var pushoverToken = this.homey.settings.get("PushoverToken");
      var pushoverUser = this.homey.settings.get("PushoverUserKey");
      
      var body = {
        token: pushoverToken,
        user: pushoverUser,
        device: device,
        title: title,
        message: message
      };
      
      axios.post("https://api.pushover.net/1/messages.json", body)
      .then((response) => {
        this.log("Command send", response.data);
      })
      .catch((error) => {
        this.log("ERROR", error);
      })
      .finally(() => {
        // always executed
      });
            
    });
    //#endregion
    
    //#region [ send-notification-with-image ]
    
    const cardWithImage = this.homey.flow.getActionCard("send-notification-with-image");
    cardWithImage.registerArgumentAutocompleteListener("device", async (query, args) => {
      
      var pushoverDevices = this.homey.settings.get("PushoverDevices");
      
      const deviceCollection = _.map(pushoverDevices.split(";"), (device: string) => {
        return {
          "name": device,
          "id": device
        };
      });
      
      // filter based on the query
      return deviceCollection.filter((result) => {
        return result.name.toLowerCase().includes(query.toLowerCase());
      });

    });

    cardWithImage.registerRunListener(async (args, state) => {
      // Arrange: settings
      var pushoverToken = this.homey.settings.get("PushoverToken");
      var pushoverUser  = this.homey.settings.get("PushoverUserKey");

      // Arrange 
      var title = args.title;
      var message = args.message;
      var device = args.device.id;
      var image = args.droptoken;      
      var imageBase64 = await this.getBase64(image.cloudUrl); 
    
      var body = {
        token: pushoverToken,
        user: pushoverUser,
        device: device,
        title: title,
        message: message,
        attachment_base64 : imageBase64,
        attachment_type: "image/jpeg"
      };

      axios.post("https://api.pushover.net/1/messages.json", body)
      .then((response) => {
        this.log("Command send", response.data);
      })
      .catch((error) => {
        this.log("ERROR", error);
      })
      .finally(() => {
        // always executed
      });
    });

    //#endregion
  }

  public getBase64 = (url:string) => {
    return axios
      .get(url, {
        responseType: 'arraybuffer'
      })
      .then(response => Buffer.from(response.data, 'binary').toString('base64'));
  }

}

module.exports = MyApp;
