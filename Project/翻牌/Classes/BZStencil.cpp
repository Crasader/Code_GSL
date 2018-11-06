#include "BZStencil.h"
#include <vector>
#include <xutility>
#include <algorithm>
using namespace std;

#define vt_create(type, VN, MAXL) type VN[MAXL];int cur_##VN=0;
#define vt_begin(X) int cur_##X=0;
#define vt_fill(X,Y,Z) X[cur_##X].x=Y;X[cur_##X].y=Z;cur_##X++;
#define vt_add_len(X,Y) cur_##X+=Y;
#define vt_first_empty(X) X+cur_##X
#define vt_get_len(X) cur_##X
#define vt_empty(X) cur_##X=0;


//因为cocos2d-x暂时没有路径函数 所以这个函数保存贝塞尔曲线的所有顶点 并且保存背面区域顶点。分别是曲线顶点到end
//为什么不用DrawNode->drawQuadBezier 呢 是因为正面背面三角形的问题。如果你不信 你自己试试便知
void  drawQuadBezier(Vec2* vertices, const Vec2 &origin, const Vec2 &control, const Vec2 &destination, unsigned int segments,
	Vec2 top, Vec2* back_v, int&bv_len,  bool b1)//b1表示是不是下半部分
{

	vt_begin(back_v);
	if (b1)
	{
		vt_fill(back_v, top.x, top.y);
		bv_len++;
	}

	vt_begin(vertices);
	float t = 0.0f;
	for (unsigned int i = 0; i < segments; i++)
	{
		float x = powf(1 - t, 2) * origin.x + 2.0f * (1 - t) * t * control.x + t * t * destination.x;
		float y = powf(1 - t, 2) * origin.y + 2.0f * (1 - t) * t * control.y + t * t * destination.y;
		t += 1.0f / segments;
		vt_fill(vertices, x, y);

		//取top 到destination 中间的顶点村到back_v去
		if (b1 && x > top.x && y > top.y)
		{
			vt_fill(back_v, x, y);
			bv_len++;
		}
		else if (!b1 && x < top.x && y < top.y)
		{
			vt_fill(back_v, x, y);
			bv_len++;
		}
	}

	if (false == b1)
	{
		vt_fill(back_v, destination.x, destination.y);
		bv_len++;
	}

}

void  drawQuadBezierltor(Vec2* vertices, const Vec2 &origin, const Vec2 &control, const Vec2 &destination, unsigned int segments,
	Vec2 top, Vec2* back_v, int&bv_len, bool b1)//b1表示是不是下半部分
{

	vt_begin(back_v);
	if (b1)
	{
		vt_fill(back_v, top.x, top.y);
		bv_len++;
	}

	vt_begin(vertices);
	float t = 0.0f;
	for (unsigned int i = 0; i < segments; i++)
	{
		float x = powf(1 - t, 2) * origin.x + 2.0f * (1 - t) * t * control.x + t * t * destination.x;
		float y = powf(1 - t, 2) * origin.y + 2.0f * (1 - t) * t * control.y + t * t * destination.y;
		t += 1.0f / segments;
		vt_fill(vertices, x, y);

		//取top 到destination 中间的顶点村到back_v去
		if (b1 && x < top.x && y > top.y)
		{
			vt_fill(back_v, x, y);
			bv_len++;
		}
		else if (!b1 && x > top.x && y < top.y)
		{
			vt_fill(back_v, x, y);
			bv_len++;
		}
	}

	if (false == b1)
	{
		vt_fill(back_v, destination.x, destination.y);
		bv_len++;
	}

}

pp::pp()
{
	is_playing = false;;
	clip_front_ = clip_back_ = nullptr;

	sp_back_ = nullptr;
	is_bzmode = true;
	page_mode = false;
	is_right_to_left = false;
}
pp* pp::create()
{
	pp* dd = new pp();
	dd->init();
	return dd;
}

void  pp::init_data()
{
	clip_back_->setPosition(Vec2(0, 0));
	clip_front_->setPosition(Vec2(0, 0));

	mCornerX = 0; // 拖拽点对应的页脚
	mCornerY = 0;

	if (is_right_to_left)
	{
		mTouch.x = mWidth * 2 / 3; //右下角开始翻页
	}else
		mTouch.x = mWidth * 1 / 3; //左下角开始翻页

	mTouch.y = mHeight/5;
	calcCornerXY(mTouch.x, mTouch.y);
	calcPoints();

	DrawNode *pfront = NULL,*pback=NULL;
	if (is_right_to_left)
	{
		make_area_rtol(pfront, pback);
	}
	else
	{
		make_area_ltor(pfront, pback);
		
	}
	
	clip_front_->setStencil(pfront);

	if (is_right_to_left)
	{
		//设置背面精灵的位置和旋转角
		sp_back_->setAnchorPoint(Vec2(0, 0));
		sp_back_->setPosition(mTouch);

		double test = atan((mTouch.x - mBezierControl1.x) / (mBezierControl1.y - mTouch.y));
		test *= (180 / 3.14159);
		sp_back_->setRotation(-test + 90);
		clip_back_->setStencil(pback);
	}
	else
	{
		//设置背面精灵的位置和旋转角
		sp_back_->setAnchorPoint(Vec2(1, 0));
		sp_back_->setPosition(mTouch);

		double test = atan((mTouch.x - mBezierControl1.x) / (mBezierControl1.y - mTouch.y));
		test *= (180 / 3.14159);
		sp_back_->setRotation(-test +270);
		clip_back_->setStencil(pback);
	}
	

}

bool pp::init()
{
	Node::init();

	//下一张牌。这里是假背景
	auto sprite = Sprite::create("page2.png");
	sprite->setAnchorPoint(Vec2(0, 0));
	this->addChild(sprite, 0);

	auto sprite1 = Sprite::create("page1.png");
	sprite1->setAnchorPoint(Vec2(0, 0));

	mWidth = sprite1->getContentSize().width;
	mHeight = sprite1->getContentSize().height;

	clip_front_ = ClippingNode::create();
	clip_front_->addChild(sprite1, 2);

	sp_back_ = Sprite::create("page1_back.png");
	sp_back_->setAnchorPoint(Vec2(0, 0));

	clip_back_ = ClippingNode::create();
	clip_back_->addChild(sp_back_, 1);

	init_data();

	this->addChild(clip_front_);
	this->addChild(clip_back_);
		
	return true;
}

void pp::update(float t)
{
	if (is_right_to_left)
	{
		update_rtol(t);
	}
	else
	{
		update_ltor(t);
	}
}


//从左到右翻
void pp::make_area_ltor(DrawNode*& pfront, DrawNode*& pback)
{
	const int max_bz_seg = 180;
	const int maxTrangle = max_bz_seg * 2 + 8;//左上角 起始点 终点 touch 起始点 终点

	auto circleColor = Color4F(1, 1, 1, 1);
	pfront = DrawNode::create();
	
	vt_create(Vec2, page1Vec, maxTrangle);
	vt_fill(page1Vec, mBezierStart2.x, mBezierStart2.y);
	vt_fill(page1Vec, mWidth, mHeight);
	vt_fill(page1Vec, 0, mHeight);
	pfront->drawPolygon(page1Vec, vt_get_len(page1Vec), circleColor, 0, circleColor);

	vt_empty(page1Vec);
	vt_fill(page1Vec, mBezierStart2.x, mBezierStart2.y);

	vt_create(Vec2, vt_tmp2, maxTrangle);
	drawQuadBezierltor(vt_first_empty(page1Vec), mBezierStart2, mBezierControl2, mBezierEnd2, max_bz_seg, mBeziervertex2, vt_tmp2, vt_get_len(vt_tmp2), false);
	vt_add_len(page1Vec, max_bz_seg);
	vt_fill(page1Vec, mBezierEnd2.x, mBezierEnd2.y);
	vt_fill(page1Vec, mTouch.x, mTouch.y);
	vt_fill(page1Vec, mWidth, mHeight);
	pfront->drawPolygon(page1Vec, vt_get_len(page1Vec), circleColor, 0, circleColor);

	vt_empty(page1Vec);
	vt_fill(page1Vec, mWidth, mHeight);
	vt_fill(page1Vec, mTouch.x, mTouch.y);
	vt_fill(page1Vec, mBezierEnd1.x, mBezierEnd1.y);
	
	vt_create(Vec2, vt_tmp1, maxTrangle);
	drawQuadBezierltor(vt_first_empty(page1Vec), mBezierStart1, mBezierControl1, mBezierEnd1, max_bz_seg, mBeziervertex1, vt_tmp1, vt_get_len(vt_tmp1), true);
	vt_add_len(page1Vec, max_bz_seg);
	vt_fill(page1Vec, mBezierStart1.x, mBezierStart1.y);
	vt_fill(page1Vec, mWidth,0);
	pfront->drawPolygon(page1Vec, vt_get_len(page1Vec), circleColor, 0, circleColor);

	float cx = (mBeziervertex1.x + mBeziervertex2.x) / 2.0f;
	float cy = (mBeziervertex1.y + mBeziervertex2.y) / 2.0f;

	//背面
	pback = DrawNode::create();
 	vt_create(Vec2, page1BackVec, maxTrangle);

	//下半部分
	vt_fill(page1BackVec,cx, cy);
	memcpy(vt_first_empty(page1BackVec), vt_tmp1, vt_get_len(vt_tmp1) * sizeof(Vec2));
	vt_add_len(page1BackVec, vt_get_len(vt_tmp1));
	vt_fill(page1BackVec, mBezierEnd1.x, mBezierEnd1.y);
	pback->drawPolygon(page1BackVec, vt_get_len(page1BackVec), circleColor, 1, circleColor);

	//上半部分
 	vt_empty(page1BackVec);
 	vt_fill(page1BackVec, cx, cy);
	vt_fill(page1BackVec, mBeziervertex2.x, mBeziervertex2.y);
 	memcpy(vt_first_empty(page1BackVec), vt_tmp2, vt_get_len(vt_tmp2) * sizeof(Vec2));
 	vt_add_len(page1BackVec, vt_get_len(vt_tmp2));
 	vt_fill(page1BackVec, mBezierEnd2.x, mBezierEnd2.y);
 	pback->drawPolygon(page1BackVec, vt_get_len(page1BackVec), circleColor, 1, circleColor);

	//中间部分
	vt_empty(page1BackVec);
	vt_fill(page1BackVec, mBezierEnd2.x, mBezierEnd2.y);
	vt_fill(page1BackVec, mTouch.x, mTouch.y);
	vt_fill(page1BackVec, mBezierEnd1.x, mBezierEnd1.y);
	vt_fill(page1BackVec, mBezierEnd2.x, mBezierEnd2.y);
	vt_fill(page1BackVec, cx, cy);
	vt_fill(page1BackVec, mBezierEnd1.x, mBezierEnd1.y);
	pback->drawPolygon(page1BackVec, vt_get_len(page1BackVec), circleColor, 0, circleColor);
	
}

void pp::update_ltor(float)
{
	if (false == is_playing)
	{
		return;
	}

	float step_per_y = 40.0f / mWidth;//touch点的y坐标每动画增幅
	//其实这里touch的y还有待优化，因为效果不是很好.
	//理论上要将一块布从右到左完全掀开 只需要水平方向的x往左移动2倍即可，（垂直方向不管怎么绕）
	//但是当mtouc.x 小于0时，这时候计算出来的贝塞尔区域完全不对头。所以下面代码强制在过中线时即开始y轴下滑
	//并保证touch.x==0时确保touch.y=0.然后再也不用贝塞尔计算stencil了。直接完全显示。

	mTouch.x++;

	//Y回落到无限0所需步数计算方法
	//Y升到中点并开始降落到无限近0需要:up_count+ down_count; up_count= (touch.x-mWidth/2)
	//当到达牌面中间位置即mTouch.x == mWidth/2，时,y坐标拥有最大高度:max_y = init_touch.y + up_count*step_per_y
	//确保在touch.x==0回落到无限0位置需要y轴自减量为：cur_step_y = max_y / (mWidth/2);
	static float cur_step_y = 0.0f;
	static float max_y = 0.0f;
	if (mTouch.x > 0 && mTouch.x < mWidth / 2)
	{
		mTouch.y += step_per_y;
	}
	else
	{
		if (max_y == 0.0f)
		{
			max_y = mTouch.y;
			cur_step_y = max_y / (mWidth / 2);
		}

		//往下走 以便尽快回复原状 其实这里用二次方程或贝塞尔说不定更适合自然效果
		if (mTouch.y - cur_step_y >= 0)
		{
			mTouch.y -= cur_step_y;
			if (false == page_mode)//非书本模式 原地翻牌模式
			{
				Vec2 dd = clip_back_->getPosition();
				clip_front_->setPosition(Vec2((mWidth / 2 - mTouch.x) / 2, dd.y));
				clip_back_->setPosition(Vec2((mWidth / 2 - mTouch.x) / 2, dd.y));
			}

		}
		else//接近Y=0时 贝塞尔不再管用。此时巧妙令touchx=0 然后启用非贝塞尔模式
		{
			is_bzmode = false;
			mTouch.y = 0.000001f;///无限接近0 但不能是0 我也是醉了
		}
	}

	if (is_bzmode)
	{
		calcPoints();

		DrawNode *pfront = NULL, *pback = NULL;
		make_area_ltor(pfront, pback);
		clip_front_->setStencil(pfront);

		//设置背面精灵的位置和旋转角
		sp_back_->setPosition(mTouch);
		double test = atan((mTouch.x - mBezierControl1.x) / (mBezierControl1.y - mTouch.y));
		test *= (180 / 3.14159);
		sp_back_->setRotation(-test +270);
		clip_back_->setStencil(pback);
		//cocos2d::log("rt:%f", -test + 90);
	}
	else{
		//设置新的clip 不再使用贝塞尔计算
		DrawNode* pff = DrawNode::create();
		Vec2 ze(0, 0);
		pff->drawDot(ze, 0, Color4F(1, 1, 1, 0));
		clip_front_->setStencil(pff);//不会清空前页stencil 只好给个空的

		static float rc_width = 0.0f;
		if (rc_width == 0.0f)
		{
			rc_width = mWidth - mBeziervertex1.x;
		}

		Vec2 dd = clip_back_->getPosition();
		static float left_x = 0.0f;
		if (left_x == 0.0f)
		{
			left_x = abs(dd.x);
		}

		if (page_mode)
		{
			//分母表示在mwidth步里面，你要把分子宽度的页面显示出来。因为书本模式时，backnode此时正在0.0位置
			rc_width += (mBeziervertex1.x) / mWidth;
		}
		else
		{
			//这里就比较紧一点，你只有left_x步，需要把mBeziervertex1.x显示出来 即
			rc_width += (mBeziervertex1.x) / (left_x);
			cocos2d::log("rc_width:%f", mBeziervertex1.x);
		}

		cocos2d::log("clip_back_ x:%f\n", dd.x);


		//构造新的背景clip 即一个完整的矩形
		vt_create(Vec2, vt, 6);
		vt_fill(vt, mWidth-rc_width, 0);
		vt_fill(vt, mWidth, 0);
		vt_fill(vt, mWidth, mHeight);
		vt_fill(vt, mWidth - rc_width, 0);
		vt_fill(vt, mWidth, mHeight);
		vt_fill(vt, mWidth - rc_width, mHeight);

		auto circleColor = Color4F(1, 1, 1, 1);
		DrawNode* pback = DrawNode::create();
		pback->drawPolygon(vt, 6, circleColor, 0, circleColor);
		sp_back_->setAnchorPoint(Vec2(1, 0));
		sp_back_->setRotation(0);
		clip_back_->setStencil(pback);


		dd.x += 1;
		clip_back_->setPosition(Vec2(dd.x, dd.y));
		if (page_mode&& dd.x >=mWidth)
		{
			cur_step_y = 0.0f;//恢复原值
			rc_width = 0.0f;
			is_playing = false;
			max_y = 0.0f;

			return;
		}
		else if (false == page_mode && dd.x >0)//有可能会出现裂缝 因为最后一步减1可能会直接变负数 出现裂缝再说。。
		{
			cur_step_y = 0.0f;//恢复原值
			rc_width = 0.0f;
			is_playing = false;
			left_x = 0.0f;
			max_y = 0.0f;
			return;
		}
	}
}

//不要修改这个函数
void pp::make_area_rtol(DrawNode*& pfront, DrawNode*& pback)
{
	//手动创造闭合区域--这里的闭合区域有问题 因为毕竟不是真正的路径闭合 那么只有求上边与左边与贝塞尔曲线的交点，这样算出来的闭合路径才对。
	//但是因为mPath0精灵外部是透明，所以闭合区域大点也没事
	const int max_bz_seg = 180;
	const int maxTrangle = max_bz_seg * 2 + 8;//左上角 起始点 终点 touch 起始点 终点

	vt_create(Vec2, page1Vec, maxTrangle);
	vt_fill(page1Vec, 0, mHeight);
	vt_fill(page1Vec, 0, 0);
	vt_fill(page1Vec, mBezierStart1.x, mBezierStart1.y);

	vt_create(Vec2, vt_tmp, maxTrangle);
	drawQuadBezier(vt_first_empty(page1Vec), mBezierStart1, mBezierControl1, mBezierEnd1, max_bz_seg, mBeziervertex1, vt_tmp, vt_get_len(vt_tmp), true);
	vt_add_len(page1Vec, max_bz_seg);
	vt_fill(page1Vec, mBezierEnd1.x, mBezierEnd1.y);
	vt_fill(page1Vec, mTouch.x, mTouch.y);
	vt_fill(page1Vec, mBezierEnd2.x, mBezierEnd2.y);


	vt_create(Vec2, page1BackVec, maxTrangle); // 保存背面区域的顶点集。。谁让cocos2d - x无法获取区域相交的部分呢？OGL或许可以
	float cx = (mBeziervertex1.x + mBeziervertex2.x) / 2.0f;
	float cy = (mBeziervertex1.y + mBeziervertex2.y) / 2.0f;
	vt_fill(page1BackVec, cx, cy);
	vt_fill(page1BackVec, mBeziervertex2.x, mBeziervertex2.y);

	drawQuadBezier(vt_first_empty(page1Vec), mBezierStart2, mBezierControl2, mBezierEnd2, max_bz_seg, mBeziervertex2, vt_first_empty(page1BackVec), vt_get_len(page1BackVec), false);
	vt_add_len(page1Vec, max_bz_seg);
	vt_fill(page1Vec, mBezierStart2.x, mBezierStart2.y);
	vt_fill(page1Vec, mWidth, mHeight);

	pfront = DrawNode::create();
	auto circleColor = Color4F(1, 1, 1, 1);
	pfront->drawPolygon(page1Vec, vt_get_len(page1Vec), circleColor, 0, circleColor);

	{
		pback = DrawNode::create();
		pback->drawPolygon(page1BackVec, vt_get_len(page1BackVec), circleColor, 0, circleColor);

		//中间部分
		vt_empty(page1BackVec);
		vt_fill(page1BackVec, mBezierEnd1.x, mBezierEnd1.y);
		vt_fill(page1BackVec, mTouch.x, mTouch.y);
		vt_fill(page1BackVec, mBezierEnd2.x, mBezierEnd2.y);
		vt_fill(page1BackVec, mBezierEnd1.x, mBezierEnd1.y);
		vt_fill(page1BackVec, cx, cy);
		vt_fill(page1BackVec, mBezierEnd2.x, mBezierEnd2.y);
		pback->drawPolygon(page1BackVec, vt_get_len(page1BackVec), circleColor, 0, circleColor);

		//画第3个多边形 这个比较麻烦 手动插点试试
		vt_empty(page1BackVec);
		vt_fill(page1BackVec, cx, cy);
		vt_fill(page1BackVec, mBeziervertex1.x, mBeziervertex1.y);
		memcpy(vt_first_empty(page1BackVec), vt_tmp, vt_get_len(vt_tmp) * sizeof(Vec2));
		vt_add_len(page1BackVec, vt_get_len(vt_tmp));//没有这个行吗
		vt_fill(page1BackVec, mBezierEnd1.x, mBezierEnd1.y);
		pback->drawPolygon(page1BackVec, vt_get_len(page1BackVec), circleColor, 0, circleColor);
	}
}

//不要修改这个函数
void pp::update_rtol(float)
{
	if (false == is_playing)
	{
		return;
	}

	float step_per_y = 40.0f / mWidth;//touch点的y坐标每动画增幅
	//其实这里touch的y还有待优化，因为效果不是很好.
	//理论上要将一块布从右到左完全掀开 只需要水平方向的x往左移动2倍即可，（垂直方向不管怎么绕）
	//但是当mtouc.x 小于0时，这时候计算出来的贝塞尔区域完全不对头。所以下面代码强制在过中线时即开始y轴下滑
	//并保证touch.x==0时确保touch.y=0.然后再也不用贝塞尔计算stencil了。直接完全显示。

	mTouch.x--;

	//Y回落到无限0所需步数计算方法
	//Y升到中点并开始降落到无限近0需要:up_count+ down_count; up_count= (touch.x-mWidth/2)
	//当到达牌面中间位置即mTouch.x == mWidth/2，时,y坐标拥有最大高度:max_y = init_touch.y + up_count*step_per_y
	//确保在touch.x==0回落到无限0位置需要y轴自减量为：cur_step_y = max_y / (mWidth/2);
	static float cur_step_y = 0.0f;
	static float max_y = 0.0f;
	if (mTouch.x < mWidth && mTouch.x > mWidth / 2)
	{
		mTouch.y += step_per_y;
	}
	else
	{
		if (max_y == 0.0f)
		{
			max_y = mTouch.y;
			cur_step_y = max_y / (mWidth / 2);
		}

		//往下走 以便尽快回复原状 其实这里用二次方程或贝塞尔说不定更适合自然效果
		if (mTouch.y - cur_step_y >= 0)
		{
			mTouch.y -= cur_step_y;
			if (false == page_mode)//非书本模式 原地翻牌模式
			{
				Vec2 dd = clip_back_->getPosition();
				clip_front_->setPosition(Vec2((mWidth / 2 - mTouch.x) / 2, dd.y));
				clip_back_->setPosition(Vec2((mWidth / 2 - mTouch.x) / 2, dd.y));
			}

		}
		else//接近Y=0时 贝塞尔不再管用。此时巧妙令touchx=0 然后启用非贝塞尔模式
		{
			is_bzmode = false;
			mTouch.y = 0.000001f;///无限接近0 但不能是0 我也是醉了
		}
	}

	if (is_bzmode)
	{
		calcPoints();

		DrawNode *pfront = NULL, *pback = NULL;
		make_area_rtol(pfront, pback);
		clip_front_->setStencil(pfront);

		//设置背面精灵的位置和旋转角
		sp_back_->setAnchorPoint(Vec2(0, 0));
		sp_back_->setPosition(mTouch);
		double test = atan((mTouch.x - mBezierControl1.x) / (mBezierControl1.y - mTouch.y));
		test *= (180 / 3.14159);
		sp_back_->setRotation(-test + 90);
		clip_back_->setStencil(pback);
		//cocos2d::log("rt:%f", -test + 90);
	}
	else{
		//设置新的clip 不再使用贝塞尔计算
		DrawNode* pff = DrawNode::create();
		Vec2 ze(0, 0);
		pff->drawDot(ze, 0, Color4F(1, 1, 1, 0));
		clip_front_->setStencil(pff);//不会清空前页stencil 只好给个空的

		static float rc_width = 0.0f;
		if (rc_width == 0.0f)
		{
			rc_width = mBeziervertex1.x;
		}

		Vec2 dd = clip_back_->getPosition();
		static float left_x = 0.0f;
		if (left_x == 0.0f)
		{
			left_x = dd.x;
		}

		if (page_mode)
		{
			//分母表示在mwidth步里面，你要把分子宽度的页面显示出来。因为书本模式时，backnode此时正在0.0位置
			rc_width += (mWidth - mBeziervertex1.x) / mWidth;
		}
		else
		{
			//这里就比较紧一点，你只有left_x步，需要把mWidth - mBeziervertex1.x显示出来 即
			rc_width += (mWidth - mBeziervertex1.x) / (left_x);
			cocos2d::log("rc_width:%f", mBeziervertex1.x);
		}



		//构造新的背景clip 即一个完整的矩形
		vt_create(Vec2, vt, 6);
		vt_fill(vt, 0, 0);
		vt_fill(vt, rc_width, 0);
		vt_fill(vt, rc_width, mHeight);
		vt_fill(vt, 0, 0);
		vt_fill(vt, rc_width, mHeight);
		vt_fill(vt, 0, mHeight);

		auto circleColor = Color4F(1, 1, 1, 1);
		DrawNode* pback = DrawNode::create();
		pback->drawPolygon(vt, 6, circleColor, 0, circleColor);

		sp_back_->setRotation(0);
		clip_back_->setStencil(pback);


		dd.x -= 1;
		clip_back_->setPosition(Vec2(dd.x, dd.y));
		if (page_mode&& dd.x < -mWidth)
		{
			cur_step_y = 0.0f;//恢复原值
			rc_width = 0.0f;
			is_playing = false;
			max_y = 0.0f;

			return;
		}
		else if (false == page_mode && dd.x < 0)//有可能会出现裂缝 因为最后一步减1可能会直接变负数 出现裂缝再说。。
		{
			cur_step_y = 0.0f;//恢复原值
			rc_width = 0.0f;
			is_playing = false;
			left_x = 0.0f;
			max_y = 0.0f;
			return;
		}
	}
}
/**
*  Author :  hmg25
*  Version:  1.0
*  Description : 计算拖拽点对应的拖拽脚
*/
void pp::calcCornerXY(float x, float y) {
	if (x <= mWidth / 2)
		mCornerX = 0;
	else
		mCornerX = mWidth;
	if (y <= mHeight / 2)
		mCornerY = 0;
	else
		mCornerY = mHeight;
	if ((mCornerX == 0 && mCornerY == mHeight)
		|| (mCornerX == mWidth && mCornerY == 0))
		mIsRTandLB = true;
	else
		mIsRTandLB = false;
}

/**
*  Author :  hmg25
*  Version:  1.0
*  Description : 求解直线P1P2和直线P3P4的交点坐标
*/
Vec2 pp::getCross(Vec2 P1, Vec2 P2, Vec2 P3, Vec2 P4) {
	Vec2 CrossP;
	// 二元函数通式： y=ax+b
	float a1 = (P2.y - P1.y) / (P2.x - P1.x);
	float b1 = ((P1.x * P2.y) - (P2.x * P1.y)) / (P1.x - P2.x);

	float a2 = (P4.y - P3.y) / (P4.x - P3.x);
	float b2 = ((P3.x * P4.y) - (P4.x * P3.y)) / (P3.x - P4.x);
	CrossP.x = (b2 - b1) / (a1 - a2);
	CrossP.y = a1 * CrossP.x + b1;
	return CrossP;
}

void pp::calcPoints() {

	mMiddleX = (mTouch.x + mCornerX) / 2;
	mMiddleY = (mTouch.y + mCornerY) / 2;
	mBezierControl1.x = mMiddleX - (mCornerY - mMiddleY)
		* (mCornerY - mMiddleY) / (mCornerX - mMiddleX);
	mBezierControl1.y = mCornerY;
	mBezierControl2.x = mCornerX;
	mBezierControl2.y = mMiddleY - (mCornerX - mMiddleX)
		* (mCornerX - mMiddleX) / (mCornerY - mMiddleY);

	// Log.i("hmg", "mTouchX  " + mTouch.x + "  mTouchY  " + mTouch.y);
	// Log.i("hmg", "mBezierControl1.x  " + mBezierControl1.x
	// + "  mBezierControl1.y  " + mBezierControl1.y);
	// Log.i("hmg", "mBezierControl2.x  " + mBezierControl2.x
	// + "  mBezierControl2.y  " + mBezierControl2.y);

	mBezierStart1.x = mBezierControl1.x - (mCornerX - mBezierControl1.x)
		/ 2;
	mBezierStart1.y = mCornerY;

	// 当mBezierStart1.x < 0或者mBezierStart1.x > 480时
	// 如果继续翻页，会出现BUG故在此限制
	if (mTouch.x > 0 && mTouch.x < mWidth) {
		if (mBezierStart1.x < 0 || mBezierStart1.x > mWidth) {
			if (mBezierStart1.x < 0)
				mBezierStart1.x = mWidth - mBezierStart1.x;

			float f1 = abs(mCornerX - mTouch.x);
			float f2 = mWidth * f1 / mBezierStart1.x;
			mTouch.x = abs(mCornerX - f2);

			float f3 = abs(mCornerX - mTouch.x)
				* abs(mCornerY - mTouch.y) / f1;
			mTouch.y = abs(mCornerY - f3);

			mMiddleX = (mTouch.x + mCornerX) / 2;
			mMiddleY = (mTouch.y + mCornerY) / 2;

			mBezierControl1.x = mMiddleX - (mCornerY - mMiddleY)
				* (mCornerY - mMiddleY) / (mCornerX - mMiddleX);
			mBezierControl1.y = mCornerY;

			mBezierControl2.x = mCornerX;
			mBezierControl2.y = mMiddleY - (mCornerX - mMiddleX)
				* (mCornerX - mMiddleX) / (mCornerY - mMiddleY);
			// Log.i("hmg", "mTouchX --> " + mTouch.x + "  mTouchY-->  "
			// + mTouch.y);
			// Log.i("hmg", "mBezierControl1.x--  " + mBezierControl1.x
			// + "  mBezierControl1.y -- " + mBezierControl1.y);
			// Log.i("hmg", "mBezierControl2.x -- " + mBezierControl2.x
			// + "  mBezierControl2.y -- " + mBezierControl2.y);
			mBezierStart1.x = mBezierControl1.x
				- (mCornerX - mBezierControl1.x) / 2;
		}
	}
	mBezierStart2.x = mCornerX;
	mBezierStart2.y = mBezierControl2.y - (mCornerY - mBezierControl2.y)
		/ 2;

	mTouchToCornerDis = (float)hypot((mTouch.x - mCornerX),
		(mTouch.y - mCornerY));

	mBezierEnd1 = getCross(mTouch, mBezierControl1, mBezierStart1,
		mBezierStart2);
	mBezierEnd2 = getCross(mTouch, mBezierControl2, mBezierStart1,
		mBezierStart2);

	// Log.i("hmg", "mBezierEnd1.x  " + mBezierEnd1.x + "  mBezierEnd1.y  "
	// + mBezierEnd1.y);
	// Log.i("hmg", "mBezierEnd2.x  " + mBezierEnd2.x + "  mBezierEnd2.y  "
	// + mBezierEnd2.y);

	/*
	* mBeziervertex1.x 推导
	* ((mBezierStart1.x+mBezierEnd1.x)/2+mBezierControl1.x)/2 化简等价于
	* (mBezierStart1.x+ 2*mBezierControl1.x+mBezierEnd1.x) / 4
	*/
	mBeziervertex1.x = (mBezierStart1.x + 2 * mBezierControl1.x + mBezierEnd1.x) / 4;
	mBeziervertex1.y = (2 * mBezierControl1.y + mBezierStart1.y + mBezierEnd1.y) / 4;
	mBeziervertex2.x = (mBezierStart2.x + 2 * mBezierControl2.x + mBezierEnd2.x) / 4;
	mBeziervertex2.y = (2 * mBezierControl2.y + mBezierStart2.y + mBezierEnd2.y) / 4;

}

