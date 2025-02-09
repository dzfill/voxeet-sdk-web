import { BaseConferenceService } from '../Service';
import { ConferenceJoined, ConferenceLeft } from '../../events/conference/index';
import ConferenceManager from './ConferenceManager';
import { SessionService } from '..';
import { JoinOptions, ListenOptions, MixingOptions, ParticipantPermissions, ReplayOptions } from '../../models/Options';
import { Participant } from '../../models/Participant';
import { MediaStreamType, MediaStreamWithType } from '../../models/MediaStream';
import Conference, { ConferenceLeaveOptions } from '../../models/Conference';
import ConferenceOptions from '../../models/ConferenceOptions';
import { ParticipantQuality } from '../../models/Simulcast';
import { WebRTCStats } from '../../models/Statistics';
import AudioProcessingOptions from '../../models/AudioProcessingOptions';
/**
 * The ConferenceService allows the application to manage the conference life-cycle and interact with the conference.
 *
 * **The ConferenceService introduces APIs that allow the application to:**
 *
 * - [Create](#create) a conference
 * - [Fetch](#fetch) the Conference object required to join a conference
 * - [Join](#join) a conference with permission to share media or as a [listener](#listen)
 * - [Set](#videoforwarding) the maximum number of video streams a participant would like to receive.
 * - Configure the quality of the received [Simulcast](#simulcast) streams
 * - Create a [demo](#demo) conference and join it
 * - [Start](#startaudio) and [stop](#stopaudio) audio transmission
 * - [Start](#startvideo) and [stop](#stopvideo) video transmission
 * - [Start](#startscreenshare) and [stop](#stopscreenshare) sharing the screen
 * - Control the [mute](#mute) state of the conference participants
 * - Get the current [mute state](#ismuted) of the local participant
 * - Check the [audio level](#audiolevel) of a specific participant
 * - Get the [participants'](#participants) list
 * - Get the [speaking status](#isspeaking) of a selected participant
 * - [Check](#localstats) the WebRTC statistics
 * - [Leave](#leave) the conference
 * - [Replay](#replay) the previously recorded conference
 * - Enable and disable [audio processing](#audioprocessing) for the local participant
 * - [Kick](#kick) a participant from a conference
 * - [Update](#updatepermissions) the participant's permissions
 * - [Ask](#current) about conference details
 *
 * **The ConferenceService introduces events that inform the application that:**
 *
 * - The participant has [joined](#joined) a conference or has [left](#left) it
 * - A connected participant [joins](#switched) a conference using another device and the same `ExternalId`
 * - A conference participant has [joined](#participantadded) a conference or [changed](#participantupdated) status
 * - A stream is [added](#streamadded), [updated](#streamupdated), or [removed](#streamremoved)
 * - The replayed conference has [ended](#ended)
 * - An [error](#error) has occurred
 * - Conference permissions have been [updated](#permissionsupdated)
 *
 * Additionally, every 5 seconds the application emits the [qualityIndicators](#qualityindicators) event informing about the audio and video quality of the remote participants.
 *
 * If a browser blocks the received audio streams due to auto-play policy, the application can call the [autoplayBlocked](#autoplayblocked) and [playBlockedAudio](#playblockedaudio) APIs to enable playing the received audio.
 *
 * ---
 * @noInheritDoc
 */
export declare class ConferenceService extends BaseConferenceService {
    #private;
    /**
     * @ignore
     * @param sdk
     * @param session
     */
    constructor(sdk: any, session: SessionService);
    /**
     * Creates a conference with [ConferenceOptions](model/conferenceoptions).
     *
     * @param options - The conference options.
     * @returns
     */
    create(options: ConferenceOptions): Promise<Conference>;
    /**
     * Provides a Conference object that allows joining a conference. For more information about using the fetch method, see the [Conferencing](/developers/interactivity-apis/reference/client-sdk/conferencing#creating-and-joining-conferences-using-the-conference-id) document.
     *
     * @param conferenceId - The conference ID.
     * @return
     */
    fetch(conferenceId: string): Promise<Conference>;
    /**
     * Creates and joins a demo conference.
     */
    demo(): Promise<Conference>;
    /**
     * Replays a previously recorded conference. For more information, see the [Recording mechanisms](/developers/interactivity-apis/guides/recording-mechanisms) article.
     *
     * See also: [join](#join), [listen](#listen)
     *
     * @param conference - The conference object.
     * @param replayOptions - The replay options.
     * @param mixingOptions - The model that notifies the server that a participant who replays the conference is a special participant called [Mixer](/developers/interactivity-apis/guides/recording-mechanisms#mixer).
     *
     * @returns
     */
    replay(conference: Conference, replayOptions?: ReplayOptions, mixingOptions?: MixingOptions): Promise<Conference>;
    /**
     * Joins a conference as a listener. You can choose to either [join](#join), [replay](#replay), or [listen](#listen) to a conference. The `listen` method connects to the conference in the receiving only mode which does not allow transmitting video or audio.
     *
     * **Note**: Conference events from other listeners are not available for listeners. Only users will receive conference events from other listeners.
     *
     * See also: [join](#join), [replay](#replay)
     *
     * @param conference - The conference object.
     * @param options - The additional options for the joining listener.
     */
    listen(conference: Conference, options?: ListenOptions): Promise<Conference>;
    /**
     * Joins the conference.
     *
     * **Note**: Participants who use Apple Mac OS and the Safari browser to join conferences may experience problems with distorted audio. To solve the problem, we recommend using the latest version of Safari.
     *
     * **Note**: Due to a known Firefox issue, a user who has never permitted Firefox to use a microphone and camera cannot join a conference as a listener. If you want to join a conference as a listener using the Firefox browser, make sure that Firefox has permission to use your camera and microphone. To check the permissions, follow these steps:
     *
     * **1.** Select the lock icon in the address bar. </br>
     * **2.** Select the right arrow placed next to `Connection Secure`. </br>
     * **3.** Select `More information`. </br>
     * **4.** Go to the `Permissions` tab. </br>
     * **5.** Look for the `Use the camera` and `Use the microphone` permission and select the `Allow` option.
     *
     * See also: [listen](#listen), [replay](#replay)
     *
     * @param conference - The conference object.
     * @param options - The additional options for the joining participant.
     * @return {Promise<Conference|Error>}
     *
     * @example
     *```javascript
     * // For example
     * const constraints = {
     *   audio: true,
     *   video: {
     *     width: {
     *       min: "320",
     *       max: "1280"
     *     },
     *     height: {
     *       min: "240",
     *       max: "720"
     *     }
     *   }
     * };
     *
     * // A simplest example of constraints would be:
     * const constraints = {audio: true, video: true};
     *
     * VoxeetSDK.conference.join(conference, {constraints: constraints})
     *   .then((info) => {
     *   })
     *   .catch((error) => {
     *   });
     * ```
     */
    join(conference: Conference, options: JoinOptions): Promise<Conference>;
    private _join;
    /**
     * Updates the participant's conference permissions. If a participant does not have permission to perform a specific action, this action is not available for this participant during a conference, and the participant receives [InsufficientPermissionsError](/developers/interactivity-apis/reference/client-sdk/reference-javascript/model/conferenceerror). If a participant started a specific action and then lost permission to perform this action, the SDK stops the blocked action. For example, if a participant started sharing a screen and received the updated permissions that do not allow him to share a screen, the SDK stops the screen sharing session and the participant cannot start sharing the screen again.
     *
     * ```javascript
     * VoxeetSDK.conference.updatePermissions(participantPermissions: Array<ParticipantPermissions>)
     * ```
     *
     * @param participantPermissions - The updated participant's permissions.
     */
    updatePermissions(participantPermissions: Array<ParticipantPermissions>): Promise<any>;
    /**
     * Leaves the conference.
     * @param options
     */
    leave(options?: ConferenceLeaveOptions): Promise<void>;
    /**
     * Allows a specific participant to play audio that is blocked by the browser's auto-play policy.
     */
    playBlockedAudio(): void;
    /**
     * Stops playing the specified remote participants' audio to the local participant or stops playing the local participant's audio to the conference. The mute method does not notify the server to stop audio stream transmission. To stop sending an audio stream to the server or to stop receiving an audio stream from the server, use the [stopAudio](#stopaudio) method.
     *
     * The mute method depends on the Dolby Voice usage:
     *
     * - In conferences where Dolby Voice is not enabled, conference participants can mute themselves or remote participants.
     * - In conferences where Dolby Voice is enabled, please use [stopAudio](#stopAudio) to mute and [startAudio](#startAudio) to unmute remote participants.
     *
     * **Note**: In SDK 2.4 and prior releases, if a conference participant calls the mute method, empty frames are sent to the other participants. Due to a Safari issue, participants who join a conference using Safari and start receiving the empty frames can experience a Safari crash. Due to a different API implementation in SDK 3.0, this problem does not occur during Dolby Voice conferences.
     *
     * @param participant - The local or remote conference participant.
     * @param isMuted - The mute state, `true` indicates that a participant is muted, `false` indicates that a participant is not muted.
     */
    mute(participant: Participant, isMuted: boolean): void;
    /**
     * Toggles mute on a participant.
     * @param participant
     * @return Mute state of the participant
     * @ignore
     */
    toggleMute(participant: Participant): boolean;
    /**
     * Gets the current mute state of the local participant.
     *
     * **Note**: This API is no longer supported for remote participants.
     *
     * @return
     */
    isMuted(): boolean;
    /**
     * Gets the participant's audio level. The possible values of the audio level are in range from 0.0 to 1.0 point.
     *
     * **Note**: This API is no longer supported for remote participants when the client connects to a Dolby Voice conference.
     *
     * @param participant - The conference participant.
     * @param callback - The callback that retrieves the audio level.
     */
    audioLevel(participant: Participant, callback: Function): any;
    /**
     * Gets the participant's current speaking status for an active talker indicator.
     * @param participant - The conference participant.
     * @param callback - The callback that accepts a boolean value indicating the participant's current speaking status. If the participant actively uses a microphone, the callback marks the participant as an active speaker.
     *
     */
    isSpeaking(participant: Participant, callback: Function): any;
    /**
     * @ignore
     * Advanced Users only.
     * @param stream
     * @param type
     */
    startStream(stream: MediaStream, type?: MediaStreamType): Promise<any>;
    /**
     * @ignore
     * @param stream
     */
    stopStream(stream: MediaStream): void;
    /**
     * Notifies the server to either start sending the local participant's video stream to the conference or start sending a remote participant's video stream to the local participant. The startVideo method does not control the remote participant's video stream; if a remote participant does not transmit any video stream, the local participant cannot change it using the startVideo method.
     *
     * @param participant - The participant who will receive the video stream, either remote or local.
     * @param constraints - The [WebRTC video constraints](https://www.w3.org/TR/mediacapture-streams/#dom-mediastreamconstraints-video).
     *
     * @return {Promise<Error>}
     *
     * @example
     *```javascript
     * const videoConstraints = {
     *     width: {
     *         min: "320",
     *         max: "1280"
     *     },
     *     height: {
     *         min: "240",
     *         max: "720"
     *     }
     * };
     *
     * VoxeetSDK.conference.startVideo(VoxeetSDK.session.participant, videoConstraints).then(() => { });
     * ```
     */
    startVideo(participant: Participant, constraints: any): Promise<any>;
    /**
     * Notifies the server to either stop sending the local participant's video stream to the conference or stop sending a remote participant's video stream to the local participant.
     * @param participant - The participant who will stop receiving the video stream.
     * @return {Promise<Error>}
     */
    stopVideo(participant: Participant): Promise<void>;
    /**
     * Sets the maximum number of video streams that may be transmitted to the local participant. This method also allows using a pin option to prioritize the specific participant's video streams and display their videos even when these participants do not talk. For more information, see the [Video Forwarding](/developers/interactivity-apis/guides/video-forwarding) article.
     * @param max - The maximum number of video streams that may be transmitted to the local participant. The valid parameter's values are between 0 and 25 for desktop browsers and between 0 and 4 for mobile browsers. In the case of providing a value smaller than 0 or greater than the valid values, SDK triggers the [VideoForwardingError](/developers/interactivity-apis/reference/client-sdk/reference-javascript/model/videoforwardingerror). If the parameter value is not specified, the SDK automatically sets the maximum possible value: 25 for desktop browsers and 4 for mobile browsers.
     * @param participants - The list of the prioritized participants. This parameter allows using a pin option to prioritize specific participant's video streams and display their videos even when these participants do not talk.
     * @return {Promise<Error>}
     */
    videoForwarding(max: number, participants?: Array<Participant>): Promise<any>;
    /**
     * Enables and disables audio processing for the local participant.
     * @param participant - The conference participant.
     * @param options - The audio processing information.
     * @return {Promise<Error>}
     */
    audioProcessing(participant: Participant, options: AudioProcessingOptions): Promise<void>;
    /**
     * Notifies the server to either:
     *
     * - Start sending the local participant's audio stream to the conference, or
     *
     * - Start sending a remote participant's audio stream to the local participant
     *
     * If the SDK does not transmit a specific remote participant's audio stream to the local participant, the local participant can enable the transmission of this stream through the startAudio method. In such a case, only the local participant starts receiving the audio stream; the startAudio method does not impact the rest of the conference participants.
     *
     * In conferences where Dolby Voice is enabled, listeners share the configuration with all other listeners. Please use the backend API https://api.voxeet.com/v2/conferences/{conference_id}/startAudioForListeners .
     *
     * If a remote participant does not transmit any audio stream, the local participant cannot change it using the startAudio method.
     *
     * The Voxeet SDK automatically manages audio rendering and, therefore, the application does not need to implement its own
     * `<audio>` element. The application can use [selectAudioInput](mediadeviceservice#selectaudioinput) and
     * [selectAudioOutput](mediadeviceservice#selectaudiooutput) methods to select the proper audio input and output devices.
     *
     * @param participant - The participant who will receive the audio stream.
     *
     * @return {Promise<Error>}
     */
    startAudio(participant: Participant): Promise<void>;
    /**
     * Notifies the server to either:
     *
     * - Stop sending the local participant's audio stream to the conference, or
     *
     * - Stop sending a remote participant's audio stream to the local participant
     *
     * If the SDK transmits a specific remote participant's audio stream to the local participant, the local participant can disable the transmission of this stream through the stopAudio method. In such a case, only the local participant stops receiving the audio stream; the stopAudio method does not impact the rest of the conference participants.
     *
     * In conferences where Dolby Voice is enabled, listeners share the configuration with all other listeners. Please use the backend API https://api.voxeet.com/v2/conferences/{conference_id}/stopAudioForListeners .
     *
     * If a remote participant transmits an audio stream, the local participant cannot change it using the stopAudio method.
     *
     * @param participant - The participant who will stop receiving the audio stream.
     * @return {Promise<Error>}
     */
    stopAudio(participant: Participant): Promise<void>;
    /**
     * Starts a screen sharing session.
     * @return {Promise<Error>}
     *
     * @example
     *```javascript
     * VoxeetSDK.conference.startScreenShare()
     *   .then(() => {
     *
     *   })
     *   .catch(e => {
     *
     *   });
     * ````
     */
    startScreenShare(sourceId?: any): any;
    /**
     * Stops the screen-sharing session.
     * @return {Promise<Error>}
     */
    stopScreenShare(): Promise<any>;
    /**
     * Provides [standard WebRTC statistics](https://www.w3.org/TR/webrtc-stats/#dom-rtcstatstype) for the application. Based on the WebRTC statistics, the SDK computes [audio and video statistics](/developers/interactivity-apis/client-sdk/reference-javascript/model/qualityindicator).
     * @return {Promise<Statistics>}
     */
    localStats(): WebRTCStats;
    /**
     * Configures the quality of the received Simulcast streams.
     *
     * @param requested - An array that includes the streams qualities for specific conference participants.
     */
    simulcast(requested: Array<ParticipantQuality>): any;
    /**
     * Allows the conference owner, or a participant with adequate permissions, to kick another participant from the conference by revoking the conference access token. The kicked participant cannot join the conference again.
     *
     * ```javascript
     * VoxeetSDK.conference.kick(participant: Participant)
     * ```
     *
     * @param participant - The participant who needs to be kicked from the conference.
     */
    kick(participant: Participant): Promise<any>;
    /**
     * Generates state dump for purpose of failure investigation. State dump is in ZIP format.
     * @ignore
     */
    createStateDump(): Promise<any>;
    /**
     *
     * @param audioLoggingLength - Length in seconds of internal audio logging.
     * @ignore
     */
    configureStateDump(audioLoggingLength: number): void;
    private qualityIndicators;
    protected onConferenceCreated(): void;
    protected onConferenceJoined(e: ConferenceJoined): void;
    protected onConferenceLeft(e: ConferenceLeft): void;
    private onConferenceEnded;
    private onConferenceDestroyed;
    private onConferenceStats;
    private onConferenceGlobalError;
    private onOfferCreated;
    private onActiveSpeakerChange;
    private onVideoForwardedChanged;
    private onDvcsMetric;
    /**
     *
     * @ignore
     */
    private onUpdateToken;
    /**
     * Updates the participant's permissions by decoding the conference access token.
     * @ignore
     */
    private updatePermissionsFromToken;
    private getPermissionsFromToken;
    private onParticipantAdded;
    private clearStream;
    private onParticipantUpdated;
    private onParticipantUpdatedHandleStreams;
    private onParticipantKicked;
    private onParticipantSwitched;
    private onOwnParticipantSwitched;
    /**
     * @ignore
     */
    onAutoplayBlocked(): void;
    /**
     * @ignore
     * @param peerId
     * @param stream
     */
    onStreamAdded(peerId: string, stream: MediaStreamWithType): void;
    /**
     * @ignore
     * @param peerId
     * @param stream
     */
    onStreamUpdated(peerId: string, stream: MediaStreamWithType): void;
    /**
     * @ignore
     * @param peerId
     * @param stream
     */
    onStreamRemoved(peerId: string, stream: MediaStreamWithType): void;
    /**
     * @ignore
     */
    get peerConnectionStatus(): String;
    /**
     * Provides a list of conference participants.
     */
    get participants(): Map<string, Participant>;
    /**
     * Provides the number of video streams that are transmitted to the local user.
     */
    get maxVideoForwarding(): number;
    /**
     * Returns information about the current conference. Use this accessor if you wish to receive information that is available in the [Conference](/developers/interactivity-apis/reference/client-sdk/reference-javascript/model/conference) object, such as the conference [alias](/developers/interactivity-apis/reference/client-sdk/reference-javascript/model/conference#alias), [ID](/developers/interactivity-apis/reference/client-sdk/reference-javascript/model/conference#id), information if the conference [is new](/developers/interactivity-apis/reference/client-sdk/reference-javascript/model/conference#isnew), conference [parameters](/developers/interactivity-apis/reference/client-sdk/reference-javascript/model/conference#params), local participant's conference [permissions](/developers/interactivity-apis/reference/client-sdk/reference-javascript/model/conference#permissions), conference [PIN code](/developers/interactivity-apis/reference/client-sdk/reference-javascript/model/conference#pincode), or conference [status](/developers/interactivity-apis/reference/client-sdk/reference-javascript/model/conference#status). For example, use the following code to ask about the local participant's conference permissions:
     *
     * ```JavaScript
     * VoxeetSDK.conference.current.permissions
     * ```
     */
    get current(): Conference | null;
    /**
     * @ignore
     */
    get manager(): ConferenceManager;
    get leaveConferenceOnBeforeUnload(): boolean;
}
