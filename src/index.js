import React from 'react';
import ReactDOM from "react-dom";
import {Alert} from 'react-bootstrap';
import User from './data/users/user';
import CommentList from "./widgets/comments/comment-list";
import PostControlBar from './widgets/posts/post-control-bar';
import ProfilePic from './widgets/users/profile-pic';
import CommentEditor from './widgets/comments/comment-editor';
import CacheController from './data/object-controller';
import CacheRegistry from './data/object-registry';
import LoginEmail from './widgets/login/login-email';
import LoginAccessCode from './widgets/login/login-access-code';
import LogoutComponent from './widgets/login/logout-component';
import ConfigService from './services/config-service';
import Log from './services/log';
import CommentRESTService from './data/comments/comment-rest-service';
import ViewRESTService from './data/view-rest-service';
import UserRESTService from './data/users/user-rest-service';
import PluginLoaderService from './services/plugin-loader-service';
import CookieService from './services/cookie-service';
import PostRESTService from './data/posts/post-rest-service';
import QueueService from './services/queue-service';
import Messages from './services/messages';
import './index.css';
import './widgets/comments/comment-editor.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

export default class Parler extends React.Component {
    commentRESTService;
    userRESTService;
    postRESTService;
    static messageDuration = 3;

    static renderPlugin(parent) {
        let divTagWrapper = document.createElement("div");
        let divTag = document.createElement("div");
        divTagWrapper.id = 'ParlerMainTagWrapper';
        divTag.id = 'ParlerMainTag';
        divTag.style.width = '100%';
        divTag.style.height = '100%';
        parent.appendChild(divTagWrapper);
        divTagWrapper.appendChild(divTag);
        ReactDOM.render(<Parler/>, divTag);
    }

    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            loggedIn: false,
            showEmail: false,
            showAccessCode: false,
            errorMessage: '',
            notificationMessage: ''
        };
        CacheRegistry.init();
        this.cache = new CacheController();
        this.cacheName = 'Parler';
        CacheRegistry.register(this.object, this.cacheName);
    }
    componentWillMount() {
        let load = () => {
            let viewRESTService = new ViewRESTService(ConfigService.getServerURLBase(), ConfigService.getHeaders());
            viewRESTService.postView(ConfigService.getRootPostId()).then((viewReesponse) => {
                this.login();
                this.setState({
                    ...this.state,
                    dataLoaded: true,
                });
            }, (error) => {
                Log.error('posting view to server.' + error)
                this.setState({ ...this.state, errorMessage: 'Could not connect to the Parler server.'});
            });
        };
        load();
        QueueService.register(this, Messages.USER_LOG_IN_EMAIL_SUBMITTED, () => { this.emailSubmit(); });
        QueueService.register(this, Messages.USER_LOG_IN_EMAIL_CANCELED, () => { this.emailCancel(); });
        QueueService.register(this, Messages.USER_LOG_IN_ACCESS_CODE_SUBMITTED, () => { this.accessCodeSubmit(); });
        QueueService.register(this, Messages.USER_LOG_IN_ACCESS_CODE_CANCELED, () => { this.accessCodeCancel(); });
        QueueService.register(this, Messages.USER_LOGGED_IN, () => { this.login(); });
        QueueService.register(this, Messages.USER_LOGGED_OUT, () => { this.logout(); });
        QueueService.register(this, Messages.COMMENT_ECHOED, () => { this.onViewChanged(); });
        QueueService.register(this, Messages.COMMENT_UPVOTED, () => { this.onViewChanged(); });
        QueueService.register(this, Messages.COMMENT_UPVOTED_UNDONE, () => { this.onViewChanged(); });
        QueueService.register(this, Messages.COMMENT_DOWNVOTED, () => { this.onViewChanged(); });
        QueueService.register(this, Messages.COMMENT_DOWNVOTED_UNDONE, () => { this.onViewChanged(); });
        QueueService.register(this, Messages.NOTIFICATION, (data) => { this.onNotification(data.message); });
        QueueService.register(this, Messages.ERROR, (data) => { this.onError(data.message); });
        QueueService.register(this, Messages.ERROR_USER_MUST_LOG_IN, (data) => { this.onMustLogIn(data); });
        QueueService.register(this, Messages.CACHE_PAGE_LOADED, () => { this.onViewChanged(); });

        this.commentRESTService = new CommentRESTService(ConfigService.getServerURLBase(), ConfigService.getHeaders());
        this.userRESTService = new UserRESTService(ConfigService.getServerURLBase(), ConfigService.getHeaders());
        this.postRESTService = new PostRESTService(ConfigService.getServerURLBase(), ConfigService.getHeaders());
        this.postRESTService.getPost('b83fbfd8a11284e9193f4aec462963df').then(( response ) => {
            let body = response.data.post.body;
            // console.log("POST REST SERVICE response: " + JSON.stringify(body));
            // console.log("POST REST SERVICE body[0]: " + body[0] + ", body[1]: " + body[1]);
            // console.log("POST REST SERVICE body[2]: " + body[2] + ", body[3]: " + body[3]);
            // console.log("POST REST SERVICE body[4]: " + body[4] + ", body[5]: " + body[5]);
            let codepoint0 = parseInt(String(body.codePointAt(0))).toString(16);
            let codepoint1 = parseInt(String(body.codePointAt(1))).toString(16);
            let codepoint2 = parseInt(String(body.codePointAt(2))).toString(16);
            let codepoint3 = parseInt(String(body.codePointAt(3))).toString(16);
            let codepoint = ((body.codePointAt(0) + body.codePointAt(1)) - 0xD800) * 0x400 + (body.codePointAt(2) + body.codePointAt(3)) - 0xDC00 + 0x10000;

            function findSurrogatePair(point) {
                // assumes point > 0xffff
                var offset = point - 0x10000,
                    lead = 0xd800 + (offset >> 10),
                    trail = 0xdc00 + (offset & 0x3ff);
                return [lead.toString(16), trail.toString(16)];
            }

            // console.log("POST REST SERVICE " + JSON.stringify(findSurrogatePair(0x1F440)));
            // console.log("POST REST SERVICE U+1F44     \xF0\x9F\x91\x80");
            // console.log("POST REST SERVICE body.codePointAt(0): " + codepoint0 + ", body.codePointAt(1): " + codepoint1);
            // console.log("POST REST SERVICE body.codePointAt(2): " + codepoint2 + ", body.codePointAt(3): " + codepoint3);
            // console.log("POST REST SERVICE codepoint: " + codepoint);
        })
        .catch(( err ) => {
            // console.log("POST REST SERVICE error: " + err);
        });
    }
    componentWillUnmount(){
    }
    setHeaders(headers) {
        ConfigService.setHeaders(headers);
        if (this.commentRESTService) this.commentRESTService.setHeaders(headers);
        if (this.loginRESTService) this.loginRESTService.setHeaders(headers);
    }
    loginClick() {
        this.setState(...this.state, { showEmail: true });
    }
    onViewChanged() {
        this.forceUpdate();
    }
    login() {
        let token = CookieService.getCookie('ParlerToken');
        if (token) {
            this.setHeaders({ 'Authorization': token });
            User.setDefaultUser({
                id: CookieService.getCookie('ParlerUserId'),
                username: CookieService.getCookie('ParlerUserName'),
                name: CookieService.getCookie('ParlerName'),
                bio: 'UNKNOWN',
                coverPhoto: 'UNKNOWN',
                profilePhoto: CookieService.getCookie('ParlerProfilePhoto'),
                private: CookieService.getCookie('ParlerPrivate'),
                verified: CookieService.getCookie('ParlerVerified')
            });

            this.setState({
                ...this.state,
                loggedIn: true,
            });
        }
        this.onViewChanged();
    }
    logout () {
        this.setHeaders({ 'Authorization': '' });
        User.setDefaultUser(User.defaultUserTemplate);
        CookieService.eraseCookie('ParlerToken');
        CookieService.eraseCookie('ParlerUserId');
        this.setState({
            ...this.state,
            loggedIn: false
        });
        this.onViewChanged();
    }
    onNotification(data) {
        this.setState(...this.state, { notificationMessage: data});
        Log.info('Notification received.');
        this.forceUpdate();
    }
    onError(data) {
        this.setState(...this.state, { errorMessage: data });
        Log.log('Error received. Data: ' + Log.stringify(data));
        this.forceUpdate();
    }
    onMustLogIn(data) {
        this.loginClick();
    }
    emailSubmit() {
        this.setState(...this.state, { showEmail: false, showAccessCode: true });
    }
    emailCancel() {
        this.setState(...this.state, { showEmail: false });
    }
    accessCodeSubmit() {
        this.setState(...this.state, { showAccessCode: false, loggedIn: true });
    }
    accessCodeCancel() {
        this.setState(...this.state, { showAccessCode: false });
        this.onViewChanged();
    }
    renderLogin(showEmail, showAccessCode) {
        let loginList = [];
        if (showEmail) {
            loginList.push(
                <LoginEmail
                    key = {"1"}
                    cacheName = {this.cacheName}
                />
            );
        } else if (showAccessCode) {
            loginList.push(
                <LoginAccessCode
                    key={"1"}
                    cacheName = {this.cacheName}
                />
            );
        }
        return loginList;
    }
    renderUserName () {
        let userName = [];
        if (!this.state.loggedIn) {
            userName.push(
                <span className={'login'} onClick={() => { this.loginClick(); }} key={"LOGIN"}>
                    Login
                </span>
            );
        } else {
            userName.push(
                <LogoutComponent
                    className={'login'}
                    username = { User.getDefaultUser().username }
                    key={"LOGOUT"}
                    cacheName = {this.cacheName}
                />
            );
        }
        return userName;
    }
    renderError() {
        let errorList = [];
        if (this.state.errorMessage.length) {
            errorList.push(
                <Alert className={'alert'} bsStyle="danger alert" key={'ALERT_FILLER'}>
                    {this.state.errorMessage}
                </Alert>
            );
            setTimeout(() => { this.setState({ ...this.state, errorMessage: '' }); }, 1000 * Parler.messageDuration);
        } else {
            errorList.push(<div key={'FILLER'}/>);
        }
        return errorList;
    }
    renderNotification() {
        let notificationList = [];
        if (this.state.notificationMessage.length) {
            notificationList.push(
                <Alert className={'alert'} bsStyle="info alert">
                    {this.state.notificationMessage}
                </Alert>
            );
            setTimeout(() => { this.setState({ ...this.state, notificationMessage: '' }); }, 1000 * Parler.messageDuration);
        } else {
            notificationList.push(<div key={'MORE_FILLER'}/>);
        }
        return notificationList;
    }
    render() {
        // CacheController maintenance.
        if (!this.state.dataLoaded) {
            Log.info('Rendering before users loaded.');
            if (0 >= this.state.errorMessage.length) {
                return (
                    <Alert className={'alert'} bsStyle="info">
                        Parler is loading...
                    </Alert>
                );
            } else {
                return (
                    <Alert className={'alert'} bsStyle="danger">
                        {this.state.errorMessage}
                    </Alert>
                );
            }
        }
        let commentCount = 'No';
        if (CacheRegistry.hasCacheController('POST_CACHE')) {
            let postCache = CacheRegistry.getCacheController('POST_CACHE');
            let postCachePage = ((postCache)? postCache.getPage(0) : null );
            let postURL = ConfigService.getRootPostId();
            let postInfo = postCachePage.getPostInfoByURL(postURL);
            commentCount = ((postInfo)? postInfo.commentCount : 'No');
        }
        if ('No' === commentCount) {
            let cache = CacheRegistry.getCacheController(this.cacheName);
            let page = ((cache)? cache.getCurrentPage().comments : null );
            let comments = ((page)? page.getComments() : null );
            commentCount = ((comments && comments.length)? comments.length : 'No');
        }
        let commentWord = ' comments';
        let loginList = this.renderLogin(this.state.showEmail, this.state.showAccessCode);
        let errorMessage = this.renderError();
        let notificationMessage = this.renderNotification();
        let commentList = [];
        commentList.push(
            <CommentList
                key={'COMMENT_LIST'}
                parentId={ConfigService.getRootPostId()}
                commentDepth={0}
                cacheName = {this.cacheName}
            />
        );

        return (
            <div className='parler-plugin'>
                { loginList }
                { errorMessage }
                { notificationMessage }
                <div id="ParlerComments"></div>
                <div className='commentCountRow'>
                    <div className={'commentCount'}>{ commentCount + commentWord }</div>
                    <div className='commentCountRemainder'>
                        <svg
                            className={'logo'}
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 100 100"
                        >
                            <path d="M39.213,75.547v0.015h14.546c20.076,0,32.716-12.534,32.716-32.607c0-20.078-12.829-31.865-32.904-31.865H13.527l0,0
                        v10.908l0,0L51.8,22.021c13.635,0,22.992,7.298,22.992,20.933c0,13.632-9.357,20.928-22.992,20.928l-12.587-0.021v0.015V75.547z"/>
                            <path d="M59.198,37.691H26.083c-6.787,0-12.309,5.522-12.309,12.309v38.909l0,0v0.002h11.19v-0.002l0,0V55.98
                        c-0.017-5.594,1.475-7.13,7.163-7.1h27.071V37.691z"/>
                        </svg>
                        { this.renderUserName() }
                    </div>
                </div>
                <PostControlBar cacheName={this.cacheName}/>
                <div className={'commentEditorPanel'}>
                    <ProfilePic
                        profilePhotoURL = {ConfigService.getServerURLBase() + '/photo?id=' + User.getDefaultUser().profilePhoto}
                        cacheName = {this.cacheName}
                    />
                    <CommentEditor
                        cacheName={this.cacheName}
                        parentId = { ConfigService.getRootPostId() }
                        commentDepth = {0}
                    />
                </div>
                { commentList }
            </div>
        );
    }
}

// ========================================

PluginLoaderService.launchParler();
