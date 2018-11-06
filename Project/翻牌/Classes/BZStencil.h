#ifndef BZStencil_h__
#define BZStencil_h__
#pragma once

///本例部分代码来自http://blog.csdn.net/gebitan505/article/details/38729061。
///因为本例效果都是由安卓和skia版本改编而成。非本人原创
//如果条件允许，请用3D做这种翻页，贝塞尔的边角会真实很多。
//再不济，请用物理系统的布料来做。
//如对本代码做出改进或有更好实现 欢迎mail glunoy@163.com 谢谢你的分享

#include "cocos2d.h"
#include "cocos-ext.h"
#include "CocosGUI.h"
using namespace cocos2d::ui;

//#define DRAW_BACK_CLIP

USING_NS_CC;
class pp :public Node
{
	friend class HelloWorld;
public:
	pp();

	~pp(){}

	static pp* create();
	virtual bool init();

	bool isPlaying(){ return is_playing; }

	void update(float);

	void init_data();

	void Play() { init_data(); is_playing = true; is_bzmode = true; }
protected:
	float mWidth;
	float mHeight;
	float mCornerX; // 拖拽点对应的页脚
	float mCornerY;

	Vec2 mTouch; // 拖拽点
	Vec2 mBezierStart1; // 贝塞尔曲线起始点
	Vec2 mBezierControl1; // 贝塞尔曲线控制点
	Vec2 mBeziervertex1; // 贝塞尔曲线顶点
	Vec2 mBezierEnd1; // 贝塞尔曲线结束点

	Vec2 mBezierStart2; // 另一条贝塞尔曲线
	Vec2 mBezierControl2;
	Vec2 mBeziervertex2;
	Vec2 mBezierEnd2;

	float mMiddleX;
	float mMiddleY;
	float mDegrees;
	float mTouchToCornerDis;

	bool mIsRTandLB;   // 是否属于右上左下

	void calcCornerXY(float x, float y);
	Vec2 getCross(Vec2 P1, Vec2 P2, Vec2 P3, Vec2 P4);
	void calcPoints();

	ClippingNode* clip_front_;
	ClippingNode* clip_back_;

	Sprite* sp_back_;//牌的背面 以后封装再说现在是测试

	bool is_playing;
	bool is_bzmode;//前期执行bz 后面完全不用
	bool page_mode;//原地翻还是按照书本翻?
	bool is_right_to_left;//是否从右往左翻
protected:
	//根据touch构造前页和背页要显示的部分
	void make_area_ltor(DrawNode*& pfront, DrawNode*& pback);// 从右往左翻
	void make_area_rtol(DrawNode*& pfront, DrawNode*& pback);

	void update_ltor(float);
	void update_rtol(float);
	
};


#endif // BZStencil_h__

