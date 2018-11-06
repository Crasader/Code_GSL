void mjResult::SaveScreenShot(const std::string& fileName, const std::function<void(const std::string&)>& callback)
{
	Image::Format format;
	if (std::string::npos != fileName.find_last_of(".")){
		auto extension = fileName.substr(fileName.find_last_of("."), fileName.length());
		if (!extension.compare(".png")) {
			format = Image::Format::PNG;
		}
		else if (!extension.compare(".jpg")) {
			format = Image::Format::JPG;
		}
		else{
			CCLOG("cocos2d: the image can only be saved as JPG or PNG format");
			return;
		}
	}
	else {
		CCLOG("cocos2d: the image can only be saved as JPG or PNG format");
		return;
	}
	int nScreenWidth = Director::sharedDirector()->getWinSize().width;
	int nScreenHeight = Director::sharedDirector()->getWinSize().height;
   
	RenderTexture *renderTexture = RenderTexture::create(nScreenWidth, nScreenHeight, Texture2D::PixelFormat::RGBA8888);
	Rect fullRect;
	fullRect.setRect(0, 0, nScreenWidth, nScreenHeight);

	Rect virtualViewPort;
	virtualViewPort.setRect(0, 0, nScreenWidth, nScreenHeight);
  //  renderTexture->setVirtualViewport(Point(0, 0), fullRect, virtualViewPort);
	renderTexture->beginWithClear(0.0f, 0.0f, 0.0f, 0.0f);
	this->visit();
#if (CC_PLATFORM_IOS == CC_TARGET_PLATFORM || CC_PLATFORM_ANDROID == CC_TARGET_PLATFORM)
     static int i = 0;
     this->setScale(i == 0 ? 0.999 : 1.001);
     i++;
     if (i == 2) {
         i = 0;
     }
 #endif
    renderTexture->end();
	renderTexture->saveToFile(fileName, format);
	auto fullPath = FileUtils::getInstance()->getWritablePath() + fileName;
	auto scheduleCallback = [&, fullPath, callback](float dt){
		callback(fullPath);
	};
	auto _schedule = Director::getInstance()->getRunningScene()->getScheduler();
	_schedule->schedule(scheduleCallback, this, 0.0f, 0, 0.0f, false, "screenshot");
    
   }