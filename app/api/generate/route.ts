import { NextRequest, NextResponse } from 'next/server'

// Brand database with real shade numbers
const BRAND_SHADES: Record<string, Array<{number: string, name: string, color: string, effect: string, scene: string}>> = {
  dior: [
    { number: '999', name: '经典正红', color: '#C41E3A', effect: '显白提气色', scene: '宴会/约会' },
    { number: '720', name: '豆沙玫瑰', color: '#B56576', effect: '温柔气质', scene: '通勤/日常' },
    { number: '840', name: '枫叶红棕', color: '#A0522D', effect: '秋冬氛围', scene: '逛街/聚餐' },
    { number: '525', name: '奶茶裸色', color: '#D4A574', effect: '自然裸妆', scene: '面试/见家长' },
  ],
  chanel: [
    { number: '58', name: '狮子红棕', color: '#8B4513', effect: '气场全开', scene: '商务/晚宴' },
    { number: '132', name: '豆沙玫瑰', color: '#C08081', effect: '知性优雅', scene: '通勤/约会' },
    { number: '627', name: '山茶花红', color: '#DC143C', effect: '明艳动人', scene: '派对/拍照' },
    { number: '196', name: '焦糖奶咖', color: '#C19A6B', effect: '日杂感', scene: '休闲/下午茶' },
  ],
  ysl: [
    { number: '21', name: '蓝调正红', color: '#C41E3A', effect: '冷白皮必备', scene: '重要场合' },
    { number: '23', name: '橙红番茄', color: '#FF6347', effect: '元气显白', scene: '夏日/出游' },
    { number: '416', name: '烂番茄', color: '#CC5500', effect: '黄皮友好', scene: '日常/百搭' },
    { number: '610', name: '奶茶冻', color: '#D2B48C', effect: '纯欲感', scene: '约会/伪素颜' },
  ],
  mac: [
    { number: 'Ruby Woo', name: '复古正红', color: '#C41E3A', effect: '经典显白', scene: '正式场合' },
    { number: 'Chili', name: '小辣椒', color: '#B22222', effect: '砖红显气质', scene: '秋冬/日常' },
    { number: 'Mocha', name: '摩卡奶茶', color: '#C19A6B', effect: '欧美裸色', scene: '通勤/轻欧美' },
    { number: 'See Sheer', name: '西柚珊瑚', color: '#FF7F50', effect: '元气少女', scene: '春夏/学生' },
    { number: 'Diva', name: '姨妈紫', color: '#800020', effect: '暗黑气场', scene: '派对/个性' },
  ],
  tomford: [
    { number: '16', name: '斯嘉丽红', color: '#C41E3A', effect: '高级显白', scene: '约会/晚宴' },
    { number: '80', name: '燃情红棕', color: '#8B4513', effect: '秋冬必备', scene: '聚餐/拍照' },
    { number: '100', name: '肉桂奶茶', color: '#D2B48C', effect: '裸妆高级', scene: '通勤/面试' },
    { number: '27', name: '无耻之徒', color: '#FF6B6B', effect: '蜜桃少女', scene: '约会/日常' },
  ],
  armani: [
    { number: '405', name: '烂番茄', color: '#CC5500', effect: '显白王者', scene: '全年通用' },
    { number: '415', name: '山楂红', color: '#B22222', effect: '复古显白', scene: '秋冬/节日' },
    { number: '214', name: '暧昧奶杏', color: '#D4A574', effect: '温柔裸感', scene: '通勤/见家长' },
    { number: '524', name: '玫瑰茶', color: '#B56576', effect: '玫瑰豆沙', scene: '约会/日常' },
  ],
  lancome: [
    { number: '196', name: '胡萝卜色', color: '#FF8C00', effect: '元气显白', scene: '春夏/出游' },
    { number: '274', name: '奶茶乌龙', color: '#D2B48C', effect: '温柔日常', scene: '通勤/素颜' },
    { number: '888', name: '小野莓', color: '#C71585', effect: '莓果显白', scene: '约会/逛街' },
    { number: '505', name: '苹果红', color: '#DC143C', effect: '少女元气', scene: '日常/拍照' },
  ],
  gucci: [
    { number: '25', name: '米开理红', color: '#C41E3A', effect: '复古华丽', scene: '派对/宴会' },
    { number: '208', name: '情倾阿根廷', color: '#FF6347', effect: '珊瑚元气', scene: '春夏/日常' },
    { number: '505', name: '复古珍妮特', color: '#B22222', effect: '铁锈红棕', scene: '秋冬/复古' },
    { number: '203', name: ' Mildred Rosewood', color: '#C08081', effect: '玫瑰豆沙', scene: '通勤/温柔' },
  ],
  givenchy: [
    { number: 'N37', name: '朱砂砖红', color: '#8B4513', effect: '复古显白', scene: '秋冬/重要场合' },
    { number: 'N27', name: '雪柿桃', color: '#FF7F50', effect: '蜜桃少女', scene: '春夏/约会' },
    { number: 'N333', name: '女神红', color: '#C41E3A', effect: '正红气场', scene: '宴会/面试' },
    { number: 'N116', name: '慵懒奶茶', color: '#D2B48C', effect: '日杂裸色', scene: '通勤/素颜' },
  ],
  charlottetilbury: [
    { number: 'Pillow Talk', name: '枕边话', color: '#C08081', effect: '裸粉经典', scene: '通勤/日常' },
    { number: 'Walk of Shame', name: '吻痕', color: '#B56576', effect: '玫瑰豆沙', scene: '约会/温柔' },
    { number: 'Red Carpet Red', name: '红毯红', color: '#C41E3A', effect: '正红气场', scene: '重要场合' },
    { number: 'Stoned Rose', name: '奶茶玫瑰', color: '#D4A574', effect: '奶茶气质', scene: '通勤/见家长' },
  ],
}

const BRAND_NAMES: Record<string, string> = {
  dior: 'Dior 迪奥',
  chanel: 'Chanel 香奈儿',
  ysl: 'YSL 圣罗兰',
  mac: 'MAC 魅可',
  tomford: 'Tom Ford',
  armani: 'Armani 阿玛尼',
  lancome: 'Lancôme 兰蔻',
  gucci: 'Gucci 古驰',
  givenchy: 'Givenchy 纪梵希',
  charlottetilbury: 'Charlotte Tilbury',
}

export async function POST(request: NextRequest) {
  try {
    const { image, brand } = await request.json()

    if (!image || !brand) {
      return NextResponse.json(
        { error: '请提供图片和品牌' },
        { status: 400 }
      )
    }

    // Step 1: Analyze image with Doubao vision model
    const brandShades = BRAND_SHADES[brand] || BRAND_SHADES['mac']
    const brandName = BRAND_NAMES[brand] || brand

    // Build the prompt with user's exact template
    const shadesText = brandShades.map((s, i) => 
      `${i+1}. ${s.number} ${s.name} - ${s.effect} - ${s.scene}`
    ).join('\n')

    const analysisPrompt = `你是一个高端美妆顾问 + 信息结构设计系统，

基于用户上传的自拍图像与指定口红品牌，
生成一张「口红推荐分析报告信息图」（9:16竖版）。

目标不是单纯展示，而是提供"清晰、有用、可决策"的推荐结果，
同时具备高级感与女性审美友好界面。

————————————
一、分析任务（先完成逻辑判断）

请分析用户：

1. 肤色（冷调 / 暖调 / 中性）
2. 明度（白皙 / 自然 / 偏深）
3. 气质（清冷 / 温柔 / 成熟 / 明艳 / 氛围感）
4. 唇部基础（唇色深浅、适合浓淡）

输出总结：
「该用户适合：{色系} + {明度} + {风格} 的口红」

————————————
二、色号推荐（品牌绑定）

从 ${brandName} 中推荐 3–5 个色号，每个包含：

* 色号编号（如 999）
* 色系名称（如 经典正红 / 枫叶棕 / 奶茶裸色）
* 上脸效果（显白 / 提气色 / 气质增强）
* 适用场景（如：通勤 / 逛街 / 约会 / 聚餐 / 宴会）

确保推荐具有差异性（不要全部同一色系）

可用色号库：
${shadesText}

请输出分析结果和推荐列表（JSON格式）：
{
  "skinTone": "冷调/暖调/中性",
  "brightness": "白皙/自然/偏深", 
  "vibe": "清冷/温柔/成熟/明艳/氛围感",
  "lipBase": "描述",
  "summary": "该用户适合：{色系} + {明度} + {风格} 的口红",
  "recommendations": [
    {"number": "色号", "name": "色系名称", "effect": "上脸效果", "scene": "适用场景", "color": "#HEX"}
  ]
}`

    // Call Doubao vision API for analysis
    const analysisResponse = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DOUBAO_API_KEY || ''}`,
      },
      body: JSON.stringify({
        model: 'doubao-1-5-vision-pro-32k-250115',
        messages: [
          {
            role: 'system',
            content: analysisPrompt
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: '请分析这张照片，给出口红推荐建议。' },
              { type: 'image_url', image_url: { url: image } }
            ]
          }
        ],
        max_tokens: 2000,
      })
    })

    if (!analysisResponse.ok) {
      const errorData = await analysisResponse.text()
      throw new Error(`分析失败: ${errorData}`)
    }

    const analysisData = await analysisResponse.json()
    const analysisText = analysisData.choices?.[0]?.message?.content || ''
    
    // Parse analysis JSON
    let analysis: any = {}
    let recommendations: any[] = []
    
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
        recommendations = analysis.recommendations || []
      }
    } catch {
      analysis = { summary: analysisText }
    }

    const summary = analysis.summary || analysisText

    // If no recommendations parsed, use default brand shades
    if (recommendations.length === 0) {
      recommendations = brandShades.slice(0, 4)
    }

    // Step 2: Generate infographic with Doubao Seedream
    const infographicPrompt = `高端美妆口红推荐信息图，9:16竖版，1080x1920px。

风格：奢侈品美妆品牌美学，柔和的粉色/玫瑰金色调，优雅衬线字体，干净现代布局，高级感与女性审美友好。

内容：
- 顶部标题："💄 专属口红推荐" 
- 用户分析区：
  · 肤色：${analysis.skinTone || '分析中'}
  · 明度：${analysis.brightness || '分析中'}
  · 气质：${analysis.vibe || '分析中'}
  · 唇部基础：${analysis.lipBase || '分析中'}
  · 总结："${summary}"

- 品牌：${brandName}
- 推荐4个色号，每个包含：
  · 色号编号和名称
  · 色块展示（用实际颜色）
  · 上脸效果
  · 适用场景

推荐色号：
${recommendations.map((s: any, i: number) => `${i+1}. ${s.number} ${s.name} (${s.color || '#C41E3A'}) - ${s.effect} - ${s.scene}`).join('\n')}

设计要求：
· 柔和渐变背景（粉色到奶油色）
· 优雅排版
· 色块用圆形展示实际颜色
· 卡片式布局展示每个色号
· 底部 subtle "Powered by AI" 文字`

    const imageResponse = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DOUBAO_API_KEY || ''}`,
      },
      body: JSON.stringify({
        model: 'doubao-seedream-4-5-251128',
        prompt: infographicPrompt,
        sequential_image_generation: 'disabled',
        response_format: 'url',
        size: '2K',
        stream: false,
        watermark: true,
      })
    })

    if (!imageResponse.ok) {
      const errorData = await imageResponse.text()
      throw new Error(`图片生成失败: ${errorData}`)
    }

    const imageData = await imageResponse.json()
    const infographicUrl = imageData.data?.[0]?.url || ''

    return NextResponse.json({
      analysis: summary,
      recommendations: recommendations,
      infographicUrl,
    })

  } catch (error: any) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error.message || '生成失败，请稍后重试' },
      { status: 500 }
    )
  }
}
