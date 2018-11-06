#include "HelloWorldScene.h"
#include "cocostudio/CocoStudio.h"
#include "ui/CocosGUI.h"
#include "BZStencil.h"
#include <string>
using namespace std;


USING_NS_CC;

using namespace cocostudio::timeline;


Scene* HelloWorld::createScene()
{
	// 'scene' is an autorelease object
	auto scene = Scene::create();

	// 'layer' is an autorelease object
	auto layer = HelloWorld::create(Color4B::GREEN);

	// add layer as a child to scene
	scene->addChild(layer);

	// return the scene
	return scene;
}

// on "init" you need to initialize your instance
bool HelloWorld::initWithColor(const Color4B& color)
{
    //////////////////////////////
    // 1. super init first
	if (!LayerColor::initWithColor(color))
    {
        return false;
    }
	
	setColor(Color3B::GREEN);
	Size visibleSize = Director::getInstance()->getVisibleSize();
	Vec2 origin = Director::getInstance()->getVisibleOrigin();

	jjj = pp::create();
	jjj->setPosition(Vec2(visibleSize.width / 2 + origin.x, visibleSize.height / 2 + origin.y));
	jjj->setScale(1);
	this->addChild(jjj);



	Button* btn = Button::create("play.png", "play1.png", "", TextureResType::LOCAL);
	btn->setPosition(Vec2(origin.x + visibleSize.width -100, origin.y + 350));
	btn->setName("play");
	this->addChild(btn);
	btn->addClickEventListener(CC_CALLBACK_1(HelloWorld::on_touch_event, this));

	Button* btn1 = Button::create("step.png", "step1.png", "", TextureResType::LOCAL);
	btn1->setPosition(Vec2(origin.x + visibleSize.width -100, origin.y + 300));
	btn1->setName("step");
	this->addChild(btn1);
	btn1->addClickEventListener(CC_CALLBACK_1(HelloWorld::on_touch_event, this));

	touch_info_ = Text::create();//名称
	touch_info_->setColor(Color3B::WHITE);

	string str_touch = "touch:x";
	str_touch += std::to_string(jjj->mTouch.x);
	str_touch += " y:";
	str_touch += std::to_string(jjj->mTouch.y);
	touch_info_->setString(str_touch);
	touch_info_->setFontSize(24);
	touch_info_->setAnchorPoint(Vec2(0.0, 1.0));
	touch_info_->setPosition(Vec2(visibleSize.width / 2 + origin.x, 50));//现在先写死 适配小屏幕时再说
	this->addChild(touch_info_);

 	CheckBox* checkBox2 = CheckBox::create("cb.png",//未选中时的显示图片
 		"cb.png",//点击checkBox后触摸没有松开时的图片
 		"cb_check.png",//选中时的显示图片
 		"cb_check.png",//从选中到未选中切换过程中，触摸没有松开时的显示图片
		"cb.png");
	checkBox2->setPosition(Point(origin.x + visibleSize.width - 100, 250));
	checkBox2->addEventListener([=](Ref* ref, CheckBox::EventType event){
		if (event == CheckBox::EventType::SELECTED) {
			if (jjj)
			{
				jjj->page_mode = true;
			}
		}
		else{
			if (jjj)
			{
				jjj->page_mode = false;
			}
		}
	});
 	this->addChild(checkBox2, 2);

	CheckBox* checkBox3 = CheckBox::create("cb_rtol.png",//未选中时的显示图片
		"cb_rtol.png",//点击checkBox后触摸没有松开时的图片
		"cb_rtol_check.png",//选中时的显示图片
		"cb_rtol_check.png",//从选中到未选中切换过程中，触摸没有松开时的显示图片
		"cb_rtol.png");
	checkBox3->setPosition(Point(origin.x + visibleSize.width - 100, 200));
	checkBox3->addEventListener([=](Ref* ref, CheckBox::EventType event){
		if (event == CheckBox::EventType::SELECTED) {
			if (jjj)
			{
				jjj->is_right_to_left = true;
			}
		}
		else{
			if (jjj)
			{
				jjj->is_right_to_left = false;
			}
		}
	});
	this->addChild(checkBox3, 2);
	

    return true;
}


void HelloWorld::on_touch_event(Ref* pSender)
{
	auto btn = static_cast<Button *>(pSender);
	if (btn->getName() == "play")
	{
		if (jjj->isPlaying())
			return;

		jjj->Play();
		schedule(schedule_selector(HelloWorld::update_t));
		
	}
	else if (btn->getName() == "step")
	{
		if (jjj->isPlaying()==false)
		{
			jjj->Play();
		}

		jjj->update(0);
		string str_touch = "touch:x";
		str_touch += std::to_string(jjj->mTouch.x);
		str_touch += " y:";
		str_touch += std::to_string(jjj->mTouch.y);
		touch_info_->setString(str_touch);
	}


}

void HelloWorld::update_t(float time)
{
	if (jjj)
	{
		jjj->update(time);
		string str_touch = "touch:x";
		str_touch += std::to_string(jjj->mTouch.x);
		str_touch += " y:";
		str_touch += std::to_string(jjj->mTouch.y);
		touch_info_->setString(str_touch);
	}
	
}
