//放弃出牌
bool CGameClientEngine::OnSubPassCard(const void * pBuffer, WORD wDataSize)
	//删除定时器
	KillGameClock(IDI_OUT_CARD);
	//设置界面，炸弹，牌
	m_GameClientView.SetPassFlag(wViewChairID,false/true);
	//玩家设置
	if ((IsLookonMode()==false)&&(pPassCard->wCurrentUser==GetMeChairID()))
	{
		ActiveGameFrame();
		m_GameClientView.m_btOutCard.ShowWindow(SW_SHOW);
		m_GameClientView.m_btPassCard.ShowWindow(SW_SHOW);
		m_GameClientView.m_btOutPrompt.ShowWindow(SW_SHOW);
		m_GameClientView.m_btOutCard.EnableWindow((VerdictOutCard()==true)?TRUE:FALSE);
														//状态判断
														if (m_GameClientView.m_btOutCard.IsWindowVisible()==FALSE) return false;
														//获取扑克
														BYTE bCardData[16];
														BYTE bShootCount=(BYTE)m_GameClientView.m_HandCardControl.GetShootCard(bCardData,CountArray(bCardData));
														//出牌判断
														//排列扑克
														m_GameLogic.SortCardList(bCardData,bShootCount);
														//分析类型
														BYTE bCardType=m_GameLogic.GetCardType(bCardData,bShootCount);
														//类型判断
														if (bCardType==CT_ERROR) return false;
														//首出判断
														//跟牌判断
														if (m_bTurnCardCount==0) return true;
														return m_GameLogic.CompareCard(bCardData,m_bTurnCardData,bShootCount,m_bTurnCardCount);
		m_GameClientView.m_btPassCard.EnableWindow((VerdictPassCard()==true)?TRUE:FALSE);
														//首出判断
														if (m_bTurnCardCount==0) return false;
														//跟随出牌
														tagOutCardResult OutCardResult;
														//出牌判断  过去能出的牌
														return (m_GameLogic.SearchOutCard(m_bHandCardData,m_bHandCardCount,m_bTurnCardData,m_bTurnCardCount,m_bTurnOutType,OutCardResult)==false);					
	}
	//设置定时器。。。
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	