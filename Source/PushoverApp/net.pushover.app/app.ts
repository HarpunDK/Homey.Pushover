import Homey from 'homey';
import axios from 'axios';
import _ from 'underscore';
import { PushoverHelper } from './Service/PushoverHelper';
import { HomeyAutocompleteHelper } from './Service/HomeyAutocompleteHelper';
import { PushoverApi } from './Service/PushoverApi';

class PushoverApp extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('PushoverApp has been initialized');

    // Image support
    const snapshot = await this.homey.images.createImage();
    // create a token & register it
    const snapshotToken = await this.homey.flow.createToken("snapshot_token", {
      type: "image",
      title: "snapshot",
      value: null
    });
    snapshotToken.setValue(snapshot);

    var pushoverDevicesFromConfiguration = this.homey.settings.get("PushoverDevices") || '';
    var pushoverTokenFromConfiguration   = this.homey.settings.get("PushoverToken") || '';
    var pushoverUserFromConfiguration    = this.homey.settings.get("PushoverUserKey") || '';

    const pushoverApiClient = new PushoverApi(pushoverTokenFromConfiguration, pushoverUserFromConfiguration, this);

    const card = this.homey.flow.getActionCard("send-notification");
    const cardWithSoundAndPriority = this.homey.flow.getActionCard("send-notification_sound_priority");
    const cardWithImage = this.homey.flow.getActionCard("send-notification-with-image");
    const cardWithImageAndSoundAndPriority = this.homey.flow.getActionCard("send-notification_sound_priority_with_image");

    HomeyAutocompleteHelper.RegisterAutocomplete(card, "device", PushoverHelper.ResolveDeviceCollection(pushoverDevicesFromConfiguration));

    HomeyAutocompleteHelper.RegisterAutocomplete(cardWithSoundAndPriority, "device", PushoverHelper.ResolveDeviceCollection(pushoverDevicesFromConfiguration));
    HomeyAutocompleteHelper.RegisterAutocomplete(cardWithSoundAndPriority, "sound", PushoverHelper.GetSoundCollection());
    HomeyAutocompleteHelper.RegisterAutocomplete(cardWithSoundAndPriority, "priority", PushoverHelper.GetPriorityCollection());

    HomeyAutocompleteHelper.RegisterAutocomplete(cardWithImage, "device", PushoverHelper.ResolveDeviceCollection(pushoverDevicesFromConfiguration));

    HomeyAutocompleteHelper.RegisterAutocomplete(cardWithImageAndSoundAndPriority, "device", PushoverHelper.ResolveDeviceCollection(pushoverDevicesFromConfiguration));
    HomeyAutocompleteHelper.RegisterAutocomplete(cardWithImageAndSoundAndPriority, "sound", PushoverHelper.GetSoundCollection());
    HomeyAutocompleteHelper.RegisterAutocomplete(cardWithImageAndSoundAndPriority, "priority", PushoverHelper.GetPriorityCollection());

    card.registerRunListener(async (args) => {
      var title = args.title;
      var message = args.message;
      var device = args.device.id;

      try {
        var body = {
          device: device,
          title: title,
          message: message
        };
  
        await pushoverApiClient.SendMessage(body);
      } catch (e: any) {
        this.error("Error occured", e);
      }

    });

    cardWithSoundAndPriority.registerRunListener(async (args, state) => {
      try  { 
        // Arrange 
          var title = args.title;
          var message = args.message;
          var device = args.device.id;
          var sound = args.sound.id;
          var priority = args.priority.id;

          var body = {
            device: device,
            title: title,
            message: message,
            priority: priority,
            sound: sound
          };

          await pushoverApiClient.SendMessage(body);
      } catch (e: any) {
        this.error("Error occured", e);
      }
    });

    cardWithImage.registerRunListener(async (args, state) => {
      // Arrange 
      var title = args.title;
      var message = args.message;
      var device = args.device.id;
      var image = args.droptoken;
      var imageBase64 = await this.getBase64(image.localUrl);

      try  {
        var body = {
          device: device,
          title: title,
          message: message,
          attachment_base64: imageBase64,
          attachment_type: "image/jpeg"
        };
  
        await pushoverApiClient.SendMessage(body);
        
      } catch (e: any) {
        this.error("Error occured", e);
      }

    });

    cardWithImageAndSoundAndPriority.registerRunListener(async (args, state) => {
      // Arrange 
      var title = args.title;
      var message = args.message;
      var device = args.device.id;
      var image = args.droptoken;
      var imageBase64 = await this.getBase64(image.localUrl);
      var sound = args.sound.id;
      var priority = args.priority.id;

      var body = {
        device: device,
        title: title,
        message: message,
        priority: priority,
        sound: sound,
        attachment_base64: imageBase64,
        attachment_type: "image/jpeg"
      };

      await pushoverApiClient.SendMessage(body);
    });


  }

  public getBase64 = (url: string) => {
    return axios
      .get(url, {
        responseType: 'arraybuffer'
      })
      .then(response => Buffer.from(response.data, 'binary').toString('base64'));
  }

}

module.exports = PushoverApp;
