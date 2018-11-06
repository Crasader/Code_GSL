#ifndef __HELLOWORLD_SCENE_H__
#define __HELLOWORLD_SCENE_H__

#include "cocos2d.h"

#include "cocos-ext.h"
#include "math\Mat4.h"

USING_NS_CC;


#include "BZStencil.h"


class HelloWorld : public cocos2d::LayerColor
{
public:
    // there's no 'id' in cpp, so we recommend returning the class instance pointer
    static cocos2d::Scene* createScene();

    // Here's a difference. Method 'init' in cocos2d-x returns bool, instead of returning 'id' in cocos2d-iphone
	virtual bool initWithColor(const Color4B& color);

    // implement the "static create()" method manually
	static HelloWorld* create(const Color4B& color)
	{
		{ HelloWorld *pRet = new(std::nothrow) HelloWorld();
		if (pRet && pRet->initWithColor(color))
		{ pRet->autorelease(); return pRet; } else { delete pRet; pRet = nullptr; return nullptr; } }
	}
	CREATE_FUNC(HelloWorld);

	void  on_touch_event(Ref*);

	void update_t(float time);

	pp* jjj;
	Text*     touch_info_;//for debug

};

#endif // __HELLOWORLD_SCENE_H__
