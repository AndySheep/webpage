// JavaScript Document
var streamStatus = 1;	//0 is stop, 1 is play, 2 is pause, 3 is FFWD, 4 is REW
var streamFastSpeed = 1; //��¼������˵��ٶȣ�1:��������; 2 4 8 16 32:����ٶ�ȡֵ; -2 -4 -8 -16 -32:���˽��ٶ�ȡֵ 
var isEndOfPlay = false;	//���Ž���
var mediaType = 0;		//�����ļ�������	-1 :error; 0 :unknown; 1:image; 2:audio;3:video

///////////////////////////////////////////////////////////////////////���������ֿ�ʼ
/*********************************************************************/
/* Function: keyEvent                                                */
/* Description: ң�������������� (�Ϻ���ɫ)                        */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function keyEvent(e)
{
	var keyValue = e.which;
	switch (keyValue) {
		case 8:		//back
			//keyBack();
			break;
		case 13:	//enter
			keyEnter();
			break;
		case 37:	//left(REW)
			keyLeft();
			break;
		case 38:	//up
			break;
		case 39:	//right(FFWD)
			keyRight();
			break;
		case 40:	//down
			break;
		case 263:	//play/pause
			playerPlayPause();
			break;
		case 259:	//volume+
			volumeControl(1);
			break;
		case 260:	//volume-
			volumeControl(2);
			break;
		case 261:	//mute
			keyMute();
			break;
		case 262:	//track
			break;
		case 0xff01:	//���ŵ�β(buffer���꣬��������Ȼ����)
			//isEndOfPlay = true;
			break;
		case 0xff02:	//���ŵ�β(������ֹͣ)
			//if (isEndOfPlay) {
				mediaType = 0;
				streamStatus = 0;
				//isEndOfPlay = false;
				showPlayerIcon();
			//}
			break;
		case 0x9973:	//DLNA_PLAY_SELECT_OK ȷ��DLNA����
			break;
		case 0x9974:	//DLNA_PLAY_SELECT_CANCEL ȡ��DLNA����
			break;
		case 0x9975:	//DLNA_PLAY_IDLE ����״̬
			break;
		case 0x9976:	//DLNA_PLAY_START ����״̬ 
			makeRequest('mediaType', getMediaType, 6);
			streamStatus = 1;
			showPlayerIcon();
			break;
		case 0x9977:	//DLNA_PLAY_STOP ֹͣ״̬ 
			mediaType = 0;
			streamStatus = 0;
			showPlayerIcon();
			break;
		case 0x9978:	//DLNA_PLAY_PAUSE ��ͣ״̬ 
			streamStatus = 2;
			showPlayerIcon();
			break;
		case 0x9979:	//DLNA_PLAY_FAST_FORWARD ���״̬ 
			streamStatus = 3;
			showPlayerIcon();
			break;
		case 0x997a:	//DLNA_PLAY_FAST_BACKWARD ����״̬
			streamStatus = 4;
			showPlayerIcon();
			break;
		default:
			break;
	}
	return;
}

/*********************************************************************/
/* Function: keyCode                                                 */
/* Description: ң������������������Ϊ��ɫ��                       */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function keyCode(e)
{
	var keyValue = e.which;
	iPanel.ioctlWrite('printf', 'keyValue=========dlna==========='+keyValue+'\n');
	switch (keyValue) {
		case 8:		//back
			//keyBack();
			break;
		case 13:	//enter
			keyEnter();
			break;
		case 37:	//left
			keyLeftHW();
			break;
		case 38:	//up
			break;
		case 39:	//right
			keyRightHW();
			break;
		case 40:	//down
			break;
		case 263:	//play/pause
			playerPlayPause();
			break;
		case 0x108:		//���
			//playerForward();
			break;
		case 0x109:		//����
			//playerBackward();
			break;
		case 261:	//mute
			keyMute();
			break;
		case 262:	//track
			break;
		case 0xff01:	//���ŵ�β(buffer���꣬��������Ȼ����)
			//isEndOfPlay = true;
			break;
		case 0xff02:	//���ŵ�β(������ֹͣ)
			//if (isEndOfPlay) {
				mediaType = 0;
				streamStatus = 0;
				//isEndOfPlay = false;
				showPlayerIcon();
			//}
			break;
		case 0x9973:	//DLNA_PLAY_SELECT_OK ȷ��DLNA����
			break;
		case 0x9974:	//DLNA_PLAY_SELECT_CANCEL ȡ��DLNA����
			break;
		case 0x9975:	//DLNA_PLAY_IDLE ����״̬
			break;
		case 0x9976:	//DLNA_PLAY_START ����״̬ 
			makeRequest('mediaType', getMediaType, 6);
			streamStatus = 1;
			showPlayerIcon();
			break;
		case 0x9977:	//DLNA_PLAY_STOP ֹͣ״̬ 
			mediaType = 0;
			streamStatus = 0;
			showPlayerIcon();
			break;
		case 0x9978:	//DLNA_PLAY_PAUSE ��ͣ״̬ 
			streamStatus = 2;
			showPlayerIcon();
			break;
		case 0x9979:	//DLNA_PLAY_FAST_FORWARD ���״̬ 
			streamStatus = 3;
			showPlayerIcon();
			break;
		case 0x997a:	//DLNA_PLAY_FAST_BACKWARD ����״̬
			streamStatus = 4;
			showPlayerIcon();
			break;
		default:
			break;
	}
	return;
}

///////////////////////////////////////////////////////////////////////���������ֽ���

///////////////////////////////////////////////////////////////////////��ʼ�����ֿ�ʼ
/*********************************************************************/
/* Function: getMediaType                                            */
/* Description: ��ò����ļ�������			                         */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-08-05                               */
/*********************************************************************/
function getMediaType()
{
	if (httpRequest.readyState==4 && httpRequest.status==200) {
		var getStatus = httpRequest.responseXML.getElementsByTagName('status').item(0).childNodes[0].nodeValue;
		mediaType = getStatus;
		if (mediaType <= 0) {
			return;
		}
		if (mediaType == 2) {
			document.getElementById('musicPlayInfo').innerHTML = dlna_MUSIC_INFO;
		} else {
			document.getElementById('musicPlayInfo').innerHTML = '';
		}
		streamStatus = 1;
		showPlayerIcon();
	}
	return;
}

/*********************************************************************/
/* Function: getConfig                                               */
/* Description: ����'������в���'������                             */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function getConfig()
{
	makeRequest('config?2', getSetupParameter, 1);
	return;
}

/*********************************************************************/
/* Function: getSetupParameter                                       */
/* Description: ��ñ�����'����'�е����в���              	         */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function getSetupParameter()
{
	if (httpRequest.readyState==4 && httpRequest.status==200) {
		var getStatus = httpRequest.responseXML.getElementsByTagName('status').item(0).childNodes[0].nodeValue;
		if (getStatus==1) {
			var chinese = 'chinese';
			var english = 'english';
			var parameter = httpRequest.responseXML.getElementsByTagName('result').item(0).childNodes[0].nodeValue.split('|');
			for(var i=0; i<parameter.length; i++) {
				eval(parameter[i]);	
			}
		}
		getRTypeRequest();
	}
	return;
}

/*********************************************************************/
/* Function: getRTypeRequest                                         */
/* Description: ���ʹ��ң����������						         */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function getRTypeRequest()
{
	makeRequest('getRType', getRTypeResponse, 1);
}

/*********************************************************************/
/* Function: getRTypeResponse                                        */
/* Description: ����ʹ��ң����������ѡ����				         */
/* Parameters:  0���Ϻ���1�ǻ�Ϊ                                     */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function getRTypeResponse()
{
	if (httpRequest.readyState==4 && httpRequest.status==200) {
		var getStatus = httpRequest.responseXML.getElementsByTagName('status').item(0).childNodes[0].nodeValue;
		var responseXMLValue = httpRequest.responseXML.getElementsByTagName('result').item(0).childNodes[0].nodeValue;
		if (responseXMLValue == 1) {
			document.onkeypress = keyCode;
		} else {
			document.onkeypress = keyEvent;
		}
		init();
	}
}

/*********************************************************************/
/* Function: init                                                    */
/* Description: ��ʼ��ҳ�����ݼ���ز���					         */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function init()
{
	dlna_LanguageSelect();
	makeRequest('volume?2', getVolumeStatus, 0);
}

/*********************************************************************/
/* Function: getVolumeStatus                                         */
/* Description: ���������״̬����������ֵ�;���״̬                 */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function getVolumeStatus()
{
	if (httpRequest.readyState==4 && httpRequest.status==200) {
		var tempStr = httpRequest.responseXML.getElementsByTagName('result').item(0).childNodes[0].nodeValue;
		var parameter = tempStr.split('|');
		isMuteStatus = parseInt(parameter[0]);
		volumeLevel = parseInt(parameter[1]);
		volumeLevel = (volumeLevel%5 == 0) ? volumeLevel : (5+volumeLevel-volumeLevel%5);
		showMuteStatus();
		if (mediaType <= 0) {
			makeRequest('mediaType', getMediaType, 6);
		}
	}
	return;
}

///////////////////////////////////////////////////////////////////////��ʼ�����ֽ���

///////////////////////////////////////////////////////////////////////����ʵ�ֲ��ֿ�ʼ
/*********************************************************************/
/* Function: keyBack                                                 */
/* Description: keyBack ����������						         */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function keyBack()
{
	makeRequest('stop', gotoMenuPage, 6);
	return;
}

/*********************************************************************/
/* Function: gotoMenuPage                                            */
/* Description: ���ص���ҳ��								         */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function gotoMenuPage()
{
	if (httpRequest.readyState==4 && httpRequest.status==200) {
		document.location.href = "menu.html";
	}
	return;
}

/*********************************************************************/
/* Function: keyEnter                                                */
/* Description: keyEnter ����������						         */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function keyEnter()
{
	if (streamStatus == 0) {	//ֹͣ״̬����������
		renderPlay();
	} else if (streamStatus == 2) {	//��ͣʱ������SEEK����
		if (currentTimeSeek == currentTime) {
			renderResume();
		} else {
			makeRequest('position', seekPlay, 6);
			//seekPlay();
		}
	} else if (streamStatus == 3 || streamStatus == 4) {	//���������״̬�£������ָ�����
		renderResume();
	}
	return;
}

/*********************************************************************/
/* Function: keyLeft                                                 */
/* Description: keyLeft ����������						         */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-15                               */
/*********************************************************************/
function keyLeft()
{
	if (streamStatus == 2) {	//��ͣ״̬��seek����
		seekControl(0);
	} else if (streamStatus != 0) {
		//playerBackward();
	}
	return;
}

/*********************************************************************/
/* Function: keyRight                                                */
/* Description: keyRight ����������						         */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-15                               */
/*********************************************************************/
function keyRight()
{
	if (streamStatus == 2) {	//��ͣ״̬��seek����
		seekControl(1);
	} else if (streamStatus != 0) {
		//playerForward();
	}
	return;
}

/*********************************************************************/
/* Function: keyLeftHW                                               */
/* Description: keyLeftHW ����������						         */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function keyLeftHW()
{
	if (streamStatus == 1) {	//����״̬��������С
		volumeControl(2);
	} else if (streamStatus == 2) {	//��ͣ״̬��seek����
		seekControl(0);
	}
	return;
}

/*********************************************************************/
/* Function: keyRightHW                                              */
/* Description: keyRightHW ����������						         */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function keyRightHW()
{
	if (streamStatus == 1) {	//����״̬����������
		volumeControl(1);
	} else if (streamStatus == 2) {	//��ͣ״̬��seek����
		seekControl(1);
	}
	return;
}

/*********************************************************************/
/* Function: keyRightHW                                              */
/* Description: keyRightHW ����������						         */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function keyMute()
{
	if (streamStatus == 1) {	//����״̬��������С
		volumeControl(3);
	}
	return;
}

/*********************************************************************/
/* Function: volumeControl                                           */
/* Description: ������������������							         */
/* Parameters: 1 is volume+, 2 is volume-, 3 is mute.                */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
var volumeOperate = 0; //ָʾ�����������ͣ�0:δ֪���� 1:������ 2:������ 3:����/�Ǿ���
var isMuteStatus = 0; //��¼����״̬��0:�Ǿ�����1:����
var volumeLevel = 100; //����ֵ
var showVolumeBarStatus = false;		//��¼��������ʾ״̬
function volumeControl(operate)
{
	var requestStatus;
	volumeOperate = operate;
	if (operate == 1 || operate == 2) {		//�����Ӽ�����
		if (isMuteStatus==1) {
			requestStatus = makeRequest('volume?0', nullFun, 0);
			if (requestStatus) {
				isMuteStatus = 0;
			} else {
				return;
			}
		} else {
			var tempLevel = (volumeOperate==1)? (volumeLevel+5) : (volumeLevel-5);
			tempLevel = (tempLevel>=100)? 100 : tempLevel;
			tempLevel = (tempLevel<=0)? 0 : tempLevel;
			requestStatus = makeRequest('volume?3|'+tempLevel, nullFun, 0);
			if (requestStatus) {
				volumeLevel = tempLevel;
			} else {
				return;
			}
		}
	} else if (operate == 3) {		//��������
		var tempMuteStatus = (isMuteStatus==0)? 1:0;
		requestStatus = makeRequest('volume?'+tempMuteStatus, nullFun, 0);
		if (requestStatus) {
			isMuteStatus = tempMuteStatus;
		} else {
			return;
		}
	}
	showVolume();
	return;
}

/*********************************************************************/
/* Function: showVolume                                              */
/* Description: ��ʾ������		                                     */
/* Parameters: 													     */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
var timerID_Volume; //��ʱ��ID������������ʾ����
function showVolume()
{
	hideProcess();
	clearTimeout(timerID_Volume);
	var imgURL = '';
	if (isMuteStatus==1) {
		muteURL = 'url(image/player/mute.png)';
		volumeURL = 'url(image/player/volumeBarOff.png)';
	} else {
		muteURL = 'url(image/player/muteOff.png)';
		volumeURL = 'url(image/player/volumeBar.png)';
	}
	var len = 4.5*volumeLevel;
	len = (len<=0)? 1 : len;
	len = (len>=450)? 450 : len;
	var showStr = ''+volumeLevel+'/100';
	document.getElementById('muteStatua').style.backgroundImage = muteURL;
	document.getElementById('volumeBar').style.backgroundImage = volumeURL;
	document.getElementById('volumeBar').style.width = ''+len+'px';
	if (len==1) {
		document.getElementById('volumeBar').style.visibility = 'hidden';
	} else {
		document.getElementById('volumeBar').style.visibility = 'visible';
	}
	document.getElementById('volumeLevel').innerHTML = showStr;
	document.getElementById('divVolume').style.backgroundImage = 'url(image/skin'+SETUP_SkinIndex+'/volumeMessage.png)';
	document.getElementById('divVolume').style.visibility = 'visible';
	showVolumeBarStatus = true;
	showMuteStatus();
	timerID_Volume = setTimeout('hideVolume()', 4000);
	return;
}

/*********************************************************************/
/* Function: hideVolume                                              */
/* Description: ����������                                           */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function hideVolume()
{
	clearTimeout(timerID_Volume);
	document.getElementById('divVolume').style.visibility = 'hidden';
	showVolumeBarStatus = false;
	showMuteStatus();
	return;
}

/*********************************************************************/
/* Function: showMuteStatus                                          */
/* Description: ��ʾ����״̬ͼ��                                     */
/* Parameters: 													     */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function showMuteStatus()
{
	if (isMuteStatus == 1) {
		var showOrHidden = showVolumeBarStatus ? 'hidden' : 'visible';
		document.getElementById('showMuteDiv').style.visibility = showOrHidden;
	} else {
		document.getElementById('showMuteDiv').style.visibility = 'hidden';
	}
	return;
}

/*********************************************************************/
/* Function: playerForward                                           */
/* Description: �������                                             */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
var maxSpeed = 32;	//��������˵������
function playerForward()
{
	if (streamStatus == 0) {	//ֹͣ״̬��������Ч
		return;
	}
	var tempSpeed = (streamStatus==4 || streamFastSpeed>=maxSpeed)? 2 : streamFastSpeed*2;
	var requestStatus = makeRequest('forward?'+tempSpeed, nullFun, 6);
	if (requestStatus) {
		streamFastSpeed = tempSpeed;
		streamStatus = 3;
		showPlayerIcon();
	}
	return;
}

/*********************************************************************/
/* Function: playerBackward                                          */
/* Description: ���˲���                                             */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function playerBackward()
{
	if (streamStatus == 0) {	//ֹͣ״̬��������Ч
		return;
	}
	var tempSpeed = (streamStatus==3 || streamFastSpeed>=maxSpeed)? 2 : streamFastSpeed*2;
	var requestStatus = makeRequest('rewind?'+tempSpeed, nullFun, 6);
	if (requestStatus) {
		streamFastSpeed = tempSpeed;
		streamStatus = 4;
		showPlayerIcon();
	}
	return;
}

/*********************************************************************/
/* Function: hidePlayerIcon                                          */
/* Description: ���ز���״̬ͼ��                                     */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
var timerID_playStatus; //��ʱ��ID������״̬��ʾ��Ϣ�Ŀ���
function hidePlayerIcon()
{
	clearTimeout(timerID_playStatus);
	document.getElementById('divPlayStatus').style.visibility = 'hidden';
	return;
}

/*********************************************************************/
/* Function: playerPlayPause                                         */
/* Description: ����/��ͣ����                                        */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function playerPlayPause()
{
	if (mediaType == 1) {
		return;
	}
	if (streamStatus == 0) {
		renderPlay();
	} else if (streamStatus == 1) {
		renderPause();
	} else if (streamStatus == 2) {
		renderResume();
	}
	return;
}

/*********************************************************************/
/* Function: renderPlay		                                         */
/* Description: ���Ų���		                                     */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function renderPlay()
{
	var requestStatus = makeRequest('play', nullFun, 6);
	if (requestStatus) {
		streamStatus = 1;
		streamFastSpeed = 1;
		showPlayerIcon();
	}
	return;
}

/*********************************************************************/
/* Function: renderPause	                                         */
/* Description: ��ͣ����		                                     */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function renderPause()
{
	var requestStatus = makeRequest('pause', nullFun, 6);
	if (requestStatus) {
		if (showVolumeBarStatus) {
			hideVolume();
		}
		streamStatus = 2;
		streamFastSpeed = 1;
		showPlayerIcon();
	}
	return;
}

/*********************************************************************/
/* Function: renderResume	                                         */
/* Description: �ָ�����		                                     */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function renderResume()
{
	var requestStatus = makeRequest('resume', nullFun, 6);
	if (requestStatus) {
		streamStatus = 1;
		streamFastSpeed = 1;
		showPlayerIcon();
	}
	return;
}

/*********************************************************************/
/* Function: showPlayerIcon                                          */
/* Description: ��ʾ����״̬ͼ��                                     */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function showPlayerIcon()
{
	clearTimeout(timerID_playStatus);
	var imgURL = '';
	if (streamStatus==0) {
		imgURL = 'image/player/stop.png';
		hideProcess();
	} else if (streamStatus==1) {
		imgURL = 'image/player/play.png';
		timerID_playStatus = setTimeout('hidePlayerIcon()', 3000);
		hideProcess();
	} else if (streamStatus==2) {
		imgURL = 'image/player/pause.png';
		showProcess();
	} else if (streamStatus==3) {
		imgURL = 'image/player/forward'+streamFastSpeed+'.png';
		showProcess();
	} else if (streamStatus==4) {
		imgURL = 'image/player/backward'+streamFastSpeed+'.png';
		showProcess();
	}
	document.getElementById('playStatusIcon').src = imgURL;
	document.getElementById('divPlayStatus').style.visibility = 'visible';
	return;
}

/*********************************************************************/
/* Function: showProcess                                             */
/* Description: ��ʾ����������ں���                                 */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
var timerID_playProcess; //ѭ����ʱ��ID����Ƶ���ŵĽ���������
var timerID_showProcess; //��ʱ��ID����ʾ��Ƶ���ŵĽ�����
var timerID_ProcessShow; //ѡʱ��ʱ��
var isPlayProcessShow = false; //��ʾ��Ƶ���ŵĽ�������״̬
function showProcess()
{
	hideVolume();
	if (isPlayProcessShow) {
		return;
	}
	clearInterval(timerID_playProcess);
	clearTimeout(timerID_showProcess);
	isPlayProcessShow = true;
	getCurrentTimeRequest();
	document.getElementById('playProcessBg').style.backgroundImage = 'url(image/skin'+SETUP_SkinIndex+'/playProcess.png)';
	setTimeout("document.getElementById('divPlayProcess').style.visibility = 'visible'", 100);
	if (streamStatus != 2) {
		timerID_playProcess = setInterval('getCurrentTimeRequest()', 1000);
		timerID_showProcess = setTimeout('hideProcess()', 3000);
	}
	return;
}

/*********************************************************************/
/* Function: hideProcess                                             */
/* Description: ���ؽ���������                                       */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function hideProcess()
{
	if (streamStatus==2 || streamStatus==3 || streamStatus==4) {
		return;
	}
	clearInterval(timerID_playProcess);
	clearTimeout(timerID_showProcess);
	isPlayProcessShow = false;
	document.getElementById('divPlayProcess').style.visibility = 'hidden';
	return;
}

/*********************************************************************/
/* Function: getCurrentTimeRequest                                   */
/* Description: ���ͻ�õ�ǰʱ�����ʱ�������                       */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function getCurrentTimeRequest()
{
	makeRequest('time', getCurrentTime, 6);
	//makeRequest('position', getCurrentTime, 6);
	return;
}

/*********************************************************************/
/* Function: getCurrentTime                                          */
/* Description: �����Ƶ�ļ��ĵ�ǰʱ��                               */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
var totalTime = 0; //��Ƶ�ļ�����ʱ��
var currentTime = 0; //��Ƶ�ļ��ĵ�ǰʱ��
function getCurrentTime()
{
	if (httpRequest.readyState==4 && httpRequest.status==200) {
		var getStatus = httpRequest.responseXML.getElementsByTagName('status').item(0).childNodes[0].nodeValue;
		if (getStatus==-1) {
			isPlayProcessShow = false;
			return;
		}
		var parameter = httpRequest.responseXML.getElementsByTagName('result').item(0).childNodes[0].nodeValue.split('|');
		totalTime = parseInt(parameter[0]/1000, 10);
		currentTime = parseInt(parameter[1]/1000, 10);
		currentTimeSeek = currentTime;
		totalTimeSeek = totalTime;
		showProcessInfo();
	}
	return;
}

/*********************************************************************/
/* Function: showProcessInfo                                         */
/* Description: ��ʾ��������ص���Ϣ���������������ȡ�����ʱ��       */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-14                               */
/*********************************************************************/
function showProcessInfo()
{
	currentTime = (currentTime>totalTime)? 0 : currentTime;
	var len = (totalTime==0||currentTime==0)? 1 : parseInt(480*currentTime/totalTime);
	len = (len>480)? 480 : len;
	len = (len<1)? 1 : len;
	var hh = doubleDigit(parseInt(currentTime/3600));
	var mm = doubleDigit(parseInt((currentTime%3600)/60));
	var ss = doubleDigit(currentTime%60);
	var currentTimeStr = ''+hh+':'+mm+':'+ss;
	hh = doubleDigit(parseInt(totalTime/3600));
	mm = doubleDigit(parseInt((totalTime%3600)/60));
	ss = doubleDigit(totalTime%60);
	var totalTimeStr = ''+hh+':'+mm+':'+ss;
	var timeStr = currentTimeStr+'/'+totalTimeStr;
	document.getElementById('processBar').style.width = ''+len+'px';
	var processBarStatus = len < 1 ? 'hidden' : 'visible';
	document.getElementById('processBar').style.visibility = processBarStatus;
	document.getElementById('seekBar').style.left = -52+len;
	document.getElementById('streamTime').innerHTML = timeStr;
/*	if (isSeekInput && !isSeekInputOk) {
		var tempTime = (isSeekSelect)? currentTimeSeek : currentTime;
		showSeekBar(currentTime);
		isSeekInputOk = true;
		document.getElementById('seekTime'+seekInputPos).style.color = '#0000ff';
	}*/
	return;
}

/*********************************************************************/
/* Function: seekControl	                                         */
/* Description: seek����										     */
/* Parameters:  0����1/16��1����1/16.                                */
/* Author&Date: zpjtop0904  2010-07-20                               */
/*********************************************************************/
var isSeekSelect = false; //ѡ��SEEK��ʱ��㣨SEEK״̬��
var currentTimeSeek;	//��ǰseekʱ��
var totalTimeSeek;		//��ʱ��
function seekControl(param)
{
	isSeekSelect = true;
	var seekStep = parseInt(totalTimeSeek/16);
	if (param==0) {
		currentTimeSeek -= seekStep;
		currentTimeSeek = (currentTimeSeek<=0)? 0 : currentTimeSeek;
	} else if (param==1) {
		currentTimeSeek += seekStep;
		currentTimeSeek = (currentTimeSeek>=totalTimeSeek)? totalTimeSeek : currentTimeSeek;
	} else {
		return;
	}
	seekShow();
	return;
}

/*********************************************************************/
/* Function: seekShow                                                */
/* Description: ��ʾSEEK��ʱ���                                     */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-20                               */
/*********************************************************************/
function seekShow()
{
	var len = (totalTimeSeek==0||currentTimeSeek==0)? 1 : parseInt(480*currentTimeSeek/totalTimeSeek);
	var len = (len>480)? 480 : len;
	var len = (len<1)? 1 : len;
	var hh = doubleDigit(parseInt(currentTimeSeek/3600));
	var mm = doubleDigit(parseInt((currentTimeSeek%3600)/60));
	var ss = doubleDigit(currentTimeSeek%60);
	var currentTimeStr = ''+hh+':'+mm+':'+ss;
	hh = doubleDigit(parseInt(totalTimeSeek/3600));
	mm = doubleDigit(parseInt((totalTimeSeek%3600)/60));
	ss = doubleDigit(totalTimeSeek%60);
	var totalTimeStr = ''+hh+':'+mm+':'+ss;
	var timeStr = currentTimeStr+'/'+totalTimeStr;
	document.getElementById('processBar').style.width = ''+len+'px';
	document.getElementById('streamTime').innerHTML = timeStr;
	//���Ž��ȱ���ͼƬ
	document.getElementById('playProcessBg').style.backgroundImage = 'url(image/skin'+SETUP_SkinIndex+'/playProcess.png)';
	document.getElementById('divPlayProcess').style.visibility = 'visible';
	return;
}

/*********************************************************************/
/* Function: seekPlay                                                */
/* Description: ��ѡ����ʱ��㿪ʼ����                               */
/* Parameters:                                                       */
/* Author&Date: zpjtop0904  2010-07-20                               */
/*********************************************************************/
function seekPlay()
{
	if (httpRequest.readyState==4 && httpRequest.status==200) {
		var getStatus = httpRequest.responseXML.getElementsByTagName('status').item(0).childNodes[0].nodeValue;
		if (getStatus==-1) {
			return;
		}
		var parameter = httpRequest.responseXML.getElementsByTagName('result').item(0).childNodes[0].nodeValue.split('|');
		var totalByte = parseInt(parameter[0], 10);
		var seekPosition = parseInt(totalByte*currentTimeSeek/totalTimeSeek,10);
		var requestStatus = makeRequest('seek?'+seekPosition, nullFun, 6);
		if (requestStatus) {
			streamStatus = 1;
			showPlayerIcon();
		}
	}
	return;
}

///////////////////////////////////////////////////////////////////////����ʵ�ֲ��ֽ���
