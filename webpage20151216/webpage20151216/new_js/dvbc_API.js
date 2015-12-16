// JavaScript Document
//扫描指定频点
function dvbc_manualScan(freq, qam, rate) {
	player.Ag_dvb_manualScan(freq, qam, rate);
	//freq:  要搜索的频点（单位：MHz）
	//qam:  频点上的调制方式  0:16QAM    1: 32QAM   2:64QAM   3:128QAM    4:256QAM   5:512QAM   6:1024QAM    7:2048QAM   8:4096QAM
	//rate:  symbal rate码率(Kbps)
}

//获取当前频点的频道数量
function dvbc_getChannelTotal() {
	return player.Ag_dvb_getTotalNumbers();	//返回值：频道数量
}

//通过索引号获取频道的LCN
function dvbc_getLcnByIndex(index) {
	return player.Ag_dvb_getLogicalChannelNumberByIndex(index);	//返回值：频道的lcn
}

//播放指定lcn的频道,lcn：逻辑频道号
function dvbc_playStream(lcn) {
	player.Ag_dvb_play(lcn);
}

//停止当前频道的播放
function dvbc_stopStream() {
	player.Ag_dvb_stopPlay();
}

//获取当前锁定的频点
function dvbc_getCurrentFreq(lcn) {
	return player.Ag_dvb_getCurrentFrequency(lcn);	//返回值：当前正在播放的频道所在的频点（单位Hz）。lcn：逻辑频道号
}

//获取频道名称
function dvbc_getChannelName(lcn, lang) {
	return player.Ag_dvb_getChannelName(lcn, lang);	//返回值：频道名称
	//lcn：逻辑频道号
	//lang：语言  0－中文   1－英文
}

//获取当前播放频道的lcn
function dvbc_getCurrentChannelLcn() {
	return player.Ag_dvb_getCurrentPlayNumber();	//返回值：当前播放频道的lcn
}

//获取指定lcn频道的索引号,lcn：逻辑频道号
function dvbc_getIndexByLcn(lcn) {
	return player.Ag_dvb_getIndexByLogicalChannelNumber(lcn);	//返回值： 逻辑频道号对应的索引号
}



