#include "HelloWorldScene.h"

USING_NS_CC;

Scene* HelloWorld::createScene()
{
    // 'scene' is an autorelease object
    auto scene = Scene::create();
    
    // 'layer' is an autorelease object
    auto layer = HelloWorld::create();

    // add layer as a child to scene
    scene->addChild(layer);

    // return the scene
    return scene;
}

// on "init" you need to initialize your instance
bool HelloWorld::init()
{
    //////////////////////////////
    // 1. super init first
    if ( !Layer::init() )
    {
        return false;
    }
    
    Size visibleSize = Director::getInstance()->getVisibleSize();
    Vec2 origin = Director::getInstance()->getVisibleOrigin();

    /////////////////////////////
    // 2. add a menu item with "X" image, which is clicked to quit the program
    //    you may modify it.

    // add a "close" icon to exit the progress. it's an autorelease object
    auto closeItem = MenuItemImage::create(
                                           "CloseNormal.png",
                                           "CloseSelected.png",
										   CC_CALLBACK_1(HelloWorld::startTrunPage3D, this));
    
	closeItem->setPosition(Vec2(origin.x + visibleSize.width - closeItem->getContentSize().width/2 ,
                                origin.y + closeItem->getContentSize().height/2));

    // create menu, it's an autorelease object
    auto menu = Menu::create(closeItem, NULL);
    menu->setPosition(Vec2::ZERO);
    this->addChild(menu, 1);

    /////////////////////////////
    // 3. add your codes below...

    // add a label shows "Hello World"
    // create and initialize a label
    
    auto label = LabelTTF::create("Hello World", "Arial", 24);
    
    // position the label on the center of the screen
    label->setPosition(Vec2(origin.x + visibleSize.width/2,
                            origin.y + visibleSize.height - label->getContentSize().height));

    // add the label as a child to this layer
    this->addChild(label, 1);

    // add "HelloWorld" splash screen"
    auto sprite = Sprite::create("HelloWorld.png");

    // position the sprite on the center of the screen
    sprite->setPosition(Vec2(visibleSize.width/2 + origin.x, visibleSize.height/2 + origin.y));

    // add the sprite as a child to this layer
    this->addChild(sprite, 0);
    
	return true;
}
void HelloWorld::schedule_function(float dt)
{
	CCLOG("1111111111111111");
}

void HelloWorld::startTrunPage3D(Ref* pSender)
{
	Size visibleSize = Director::getInstance()->getVisibleSize();
	Vec2 origin = Director::getInstance()->getVisibleOrigin();

	// add "HelloWorld" splash screen"
	auto sprite = Sprite::create("HelloWorld.png");

	// position the sprite on the center of the screen
	sprite->setPosition(Vec2(visibleSize.width / 2 + origin.x, visibleSize.height / 2 + origin.y));

	// add the sprite as a child to this layer
	//this->addChild(sprite, 0);

	//=================================================================================================================

	//创建一个网格节点
	auto nodegrid = NodeGrid::create();
	//指定其位置
	nodegrid->setPosition(Vec2::ZERO);
	//把所需特效的节点添加到网格节点中（所需特效的节点不能先添加到当前节点中，否则出错）
	nodegrid->addChild(sprite);
	//把网格节点添加到节点中
	this->addChild(nodegrid);


	Director::getInstance()->setDepthTest(false);    //关闭深度检测
	//  Director::getInstance()->setDepthTest(true);     //开启深度检测
	static int index = 1;
	switch (index++)
	{
		case 1:
		{
				  //翻页效果
				  auto pageturn = PageTurn3D::create(2, Size(20, 18));
				  nodegrid->runAction(pageturn);
		}
			break;
		case 2:
		{
				  //震动效果
				  auto shaky = Shaky3D::create(6, Size(2, 1), 5, false);
				  nodegrid->runAction(shaky);
		}
			break;
		case 3:
		{
				  //翻转效果
				  auto flipX = FlipX3D::create(2);
				  auto reFlipX = flipX->reverse();
				  auto delay = DelayTime::create(2);      //延时2秒
				  nodegrid->runAction(Sequence::create(flipX, delay, reFlipX, NULL));
		}
			break;
		case 4:
		{
				  //    //透镜效果
				  //参数依次为：持续时间、网格大小、中心坐标、半径
				  auto lens = Lens3D::create(5, Size(32, 24), Size(visibleSize.width / 2, visibleSize.height / 2), 300);
				  nodegrid->runAction(lens);
		}
			break;
		case 5:
		{
				  //    //液体效果
				  //参数依次为：持续时间、网格大小、波纹数、振幅
				  auto liquid = Liquid::create(3, Size(16, 12), 4, 10);   //参数依次为：持续时间、网格大小、波纹数、振幅
				  nodegrid->runAction(liquid);
		}
			break;
		case 6:
		{
				  //    //波纹效果
				  auto ripple = Ripple3D::create(5, Size(20, 16), Size(visibleSize.width / 2, visibleSize.height / 2), 300, 6, 50);
				  nodegrid->runAction(ripple);
		}
			break;
		case 7:
		{
				  //    //波浪效果
				  auto wave = Waves3D::create(5, Size(25, 20), 6, 30);
				  nodegrid->runAction(wave);
		}
			break;
		default:
			index = 1;
			break;
	}

	return;
}

void HelloWorld::menuCloseCallback(Ref* pSender)
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WP8) || (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
	MessageBox("You pressed the close button. Windows Store Apps do not implement a close button.","Alert");
    return;
#endif

    Director::getInstance()->end();

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    exit(0);
#endif
}
