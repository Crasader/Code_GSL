//配置桌子
bool CTableFrameSink::Initialization(IUnknownEx * pIUnknownEx)
	
	

//游戏消息 接受处理
bool CTableFrameSink::OnGameMessage(WORD wSubCmdID, VOID * pData, WORD wDataSize, IServerUserItem * pIServerUserItem)
{
	//出牌
	case SUB_C_OUT_CART:
		//变量定义
		CMD_C_OutCard * pOutCard=(CMD_C_OutCard *)pData;
		//用户效验
		tagUserInfo * pUserData=pIServerUserItem->GetUserInfo();
		if (pUserData->cbUserStatus!=US_PLAYING) return true;
		//消息处理
		return OnUserOutCard(pUserData->wChairID,pOutCard->bCardData,pOutCard->bCardCount);
			//类型判断
			BYTE bCardType=m_GameLogic.GetCardType(bCardData,bCardCount);
			//首出判断。。。
			//更随出牌  比牌 是否大于turn
			if (m_bTurnCardCount==0) m_bTurnCardCount=bCardCount;
			else if (m_GameLogic.CompareCard(bCardData,m_bTurnCardData,bCardCount,m_bTurnCardCount)==false) return false;
			//删除扑克
			if (m_GameLogic.RemoveCard(bCardData,bCardCount,m_bHandCardData[wChairID],m_bCardCount[wChairID])==false) return false;
			m_bCardCount[wChairID]-=bCardCount;
			//出牌记录
			m_bTurnCardType=bCardType;
			m_bTurnCardCount=bCardCount;
			CopyMemory(m_bTurnCardData,bCardData,sizeof(BYTE)*bCardCount);
			//切换用户
			m_wTurnWiner=wChairID;
			if (m_bCardCount[wChairID]!=0) m_wCurrentUser=(m_wCurrentUser+1)%m_wPlayerCount;
			else m_wCurrentUser=INVALID_CHAIR;
			//发送数据
			WORD wSendSize=sizeof(OutCard)-sizeof(OutCard.bCardData)+OutCard.bCardCount*sizeof(BYTE);
			m_pITableFrame->SendTableData(INVALID_CHAIR,SUB_S_OUT_CARD,&OutCard,wSendSize);
			m_pITableFrame->SendLookonData(INVALID_CHAIR,SUB_S_OUT_CARD,&OutCard,wSendSize);			
	//过牌
	case SUB_C_PASS_CARD:
		//用户效验
		tagUserInfo * pUserData=pIServerUserItem->GetUserInfo();
		if (pUserData->cbUserStatus!=US_PLAYING) return true;
		//消息处理
		return OnUserPassCard(pUserData->wChairID);
			//扑克分析，获取能出的牌
			tagOutCardResult OutCardResult;
			m_GameLogic.SearchOutCard(m_bHandCardData[wChairID],m_bCardCount[wChairID],m_bTurnCardData,m_bTurnCardCount,m_bTurnCardType,OutCardResult);
			//判断能否放弃出牌，判断炸弹
			//发送数据
			CMD_S_PassCard PassCard  。。。。
			m_pITableFrame->SendTableData(INVALID_CHAIR,SUB_S_PASS_CARD,&PassCard,sizeof(PassCard));
			m_pITableFrame->SendLookonData(INVALID_CHAIR,SUB_S_PASS_CARD,&PassCard,sizeof(PassCard));
}
	
	

//游戏开始
bool CTableFrameSink::OnEventGameStart()
{
	//设置状态
	m_pITableFrame->SetGameStatus(GAME_SCENE_PLAY);
	//混乱扑克
	BYTE bRandCard[48];
	m_GameLogic.RandCardList(bRandCard,CountArray(bRandCard));
	//分发+排序扑克
	for (WORD i=0;i<m_wPlayerCount;i++)
	{
		m_bCardCount[i]=16;
		CopyMemory(&m_bHandCardData[i],&bRandCard[i*m_bCardCount[i]],sizeof(BYTE)*m_bCardCount[i]);
		m_GameLogic.SortCardList(m_bHandCardData[i],m_bCardCount[i]);
	}
	//设置用户
	//分析扑克
	tagAnalyseResult AnalyseResult;
	m_GameLogic.AnalysebCardData(m_bHandCardData[m_wCurrentUser],m_bCardCount[m_wCurrentUser],AnalyseResult);
	//发送扑克
	CMD_S_GameStart GameStart;
	GameStart.wBankerUser=m_wBankerUser;
	GameStart.wCurrentUser=m_wCurrentUser;
	for (WORD i=0;i<m_wPlayerCount;i++)
	{
		CopyMemory(GameStart.cbCardData,m_bHandCardData[i],sizeof(GameStart.cbCardData));
		m_pITableFrame->SendTableData(i,SUB_S_GAME_START,&GameStart,sizeof(GameStart));
		m_pITableFrame->SendLookonData(i,SUB_S_GAME_START,&GameStart,sizeof(GameStart));//发生消息to客户端，游戏开始
		ZeroMemory(GameStart.cbCardData,sizeof(GameStart.cbCardData));
	}
	//胜利处理
	if (m_wCurrentUser==INVALID_CHAIR) OnEventGameConclude(m_wBankerUser,NULL,GER_NORMAL);
}		
	
	
	
//游戏结束  结束判断
bool CTableFrameSink::OnEventGameConclude(WORD wChairID, IServerUserItem * pIServerUserItem, BYTE cbReason)
{
	//游戏解散
	case GER_DISMISS:	
		//构造数据 结束结构体
		CMD_S_GameEnd GameEnd;
		//剩余扑克
		BYTE bCardPos=0;
		for (WORD i=0;i<m_wPlayerCount;i++)
		{
			GameEnd.bCardCount[i]=m_bCardCount[i];
			CopyMemory(&GameEnd.bCardData[bCardPos],m_bHandCardData[i],m_bCardCount[i]*sizeof(BYTE));
			bCardPos+=m_bCardCount[i];
		}
		//发送信息
		m_pITableFrame->SendTableData(INVALID_CHAIR,SUB_S_GAME_END,&GameEnd,sizeof(GameEnd));
		m_pITableFrame->SendLookonData(INVALID_CHAIR,SUB_S_GAME_END,&GameEnd,sizeof(GameEnd));
		//结束游戏
		m_pITableFrame->ConcludeGame(GAME_SCENE_FREE);
	//常规结束	
	case GER_NORMAL:	
		//定义变量 结束结构体
		CMD_S_GameEnd GameEnd;
		//剩余扑克
		BYTE bCardPos=0;
		for (WORD i=0;i<m_wPlayerCount;i++)
		{
			GameEnd.bCardCount[i]=m_bCardCount[i];
			CopyMemory(&GameEnd.bCardData[bCardPos],m_bHandCardData[i],m_bCardCount[i]*sizeof(BYTE));
			bCardPos+=m_bCardCount[i];
		}
		//统计积分+税收
		。。。。。。
		//写入积分
		m_pITableFrame->WriteTableScore(ScoreInfo,CountArray(ScoreInfo));
		//结束信息 构建
		CString szEndMessage;
		szEndMessage.Format(TEXT("本局结束，成绩统计：\n %s ： %I64d 分\n %s ： %I64d 分\n %s ： %I64d 分\n"),
			m_pITableFrame->GetTableUserItem(0)->GetNickName(),GameEnd.lGameScore[0],m_pITableFrame->GetTableUserItem(1)->GetNickName(),GameEnd.lGameScore[1],
			m_pITableFrame->GetTableUserItem(2)->GetNickName(),GameEnd.lGameScore[2]);
		//发送信息
		m_pITableFrame->SendTableData(INVALID_CHAIR,SUB_S_GAME_END,&GameEnd,sizeof(GameEnd));
		m_pITableFrame->SendLookonData(INVALID_CHAIR,SUB_S_GAME_END,&GameEnd,sizeof(GameEnd));
		//结束游戏
		m_pITableFrame->ConcludeGame(GAME_SCENE_FREE);
	//用户强退
	case GER_USER_LEAVE:
	//网络错误
	case GER_NETWORK_ERROR:	
		//定义变量 结束结构体
		CMD_S_GameEnd GameEnd;
		//剩余扑克
		BYTE bCardPos=0;
		for (WORD i=0;i<m_wPlayerCount;i++)
		{
			GameEnd.bCardCount[i]=m_bCardCount[i];
			CopyMemory(&GameEnd.bCardData[bCardPos],m_bHandCardData[i],m_bCardCount[i]*sizeof(BYTE));
			bCardPos+=m_bCardCount[i];
		}
		//统计积分  掉线玩家陪分
		GameEnd.lGameScore[wChairID]=-32L*m_pGameServiceOption->lCellScore;
		GameEnd.lGameScore[(wChairID+1)%m_wPlayerCount]=16L*m_pGameServiceOption->lCellScore;
		GameEnd.lGameScore[(wChairID+2)%m_wPlayerCount]=16L*m_pGameServiceOption->lCellScore
		//发送信息
		m_pITableFrame->SendTableData(INVALID_CHAIR,SUB_S_GAME_END,&GameEnd,sizeof(GameEnd));
		m_pITableFrame->SendLookonData(INVALID_CHAIR,SUB_S_GAME_END,&GameEnd,sizeof(GameEnd));
		//框架接口 显示积分
		m_pITableFrame->WriteTableScore(ScoreInfo,CountArray(ScoreInfo));
		//结束游戏
		m_pITableFrame->ConcludeGame(GAME_SCENE_FREE);
}
		
	
	
//发送场景
bool CTableFrameSink::OnEventSendGameScene(WORD wChairID, IServerUserItem * pIServerUserItem, BYTE cbGameStatus, bool bSendSecret)
{
	switch (cbGameStatus)
	{
	//空闲状态
	case GAME_SCENE_FREE:		
		//构造数据
		CMD_S_StatusFree StatusFree;
		//设置变量
		StatusFree.lBaseScore=m_lCellScore;
		//发送场景
		return m_pITableFrame->SendGameScene(pIServerUserItem,&StatusFree,sizeof(StatusFree));
	//游戏状态
	case GAME_SCENE_PLAY:
		//构造数据+设置变量
		CMD_S_StatusPlay StatusPlay;
		//发送场景
		return m_pITableFrame->SendGameScene(pIServerUserItem,&StatusPlay,sizeof(StatusPlay));
	}
}


//定时器事件
bool CTableFrameSink::OnTimerMessage(DWORD wTimerID, WPARAM wBindParam)
{
	return false;
}



//游戏消息
bool CTableFrameSink::OnGameMessage(WORD wSubCmdID, VOID * pData, WORD wDataSize, IServerUserItem * pIServerUserItem)
{
	switch (wSubCmdID)
	{
	//用户出牌
	case SUB_C_OUT_CART:		
		//变量定义
		CMD_C_OutCard * pOutCard=(CMD_C_OutCard *)pData;
		......
		//用户效验
		tagUserInfo * pUserData=pIServerUserItem->GetUserInfo();
		if (pUserData->cbUserStatus!=US_PLAYING) return true
		//消息处理
		return OnUserOutCard(pUserData->wChairID,pOutCard->bCardData,pOutCard->bCardCount);
	case SUB_C_PASS_CARD:
		{
			//用户效验
			tagUserInfo * pUserData=pIServerUserItem->GetUserInfo();
			if (pUserData->cbUserStatus!=US_PLAYING) return true;

			//消息处理
			return OnUserPassCard(pUserData->wChairID);
		}
	}
	return false;
}		
		
		
		
		
		
		