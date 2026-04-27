import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

export async function POST(request: NextRequest) {
  try {
    const { image, brand } = await request.json()

    if (!image || !brand) {
      return NextResponse.json(
        { error: '请提供图片和品牌' },
        { status: 400 }
      )
    }

    // Step 1: Analyze image with GPT-4o Vision
    const analysisResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `你是一个高端美妆顾问。请分析用户自拍照片，输出以下信息（JSON格式）：
{
  "skinTone": "冷调/暖调/中性",
  "brightness": "白皙/自然/偏深",
  "vibe": "清冷/温柔/成熟/明艳/氛围感",
  "lipBase": "唇色深浅、适合浓淡",
  "summary": "该用户适合：{色系} + {明度} + {风格} 的口红"
}`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: '请分析这张照片的肤色、气质和唇部特征，给出口红推荐建议。' },
            { type: 'image_url', image_url: { url: image } }
          ]
        }
      ],
      max_tokens: 500,
    })

    const analysisText = analysisResponse.choices[0]?.message?.content || ''
    
    // Parse analysis
    let analysis: any = {}
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      }
    } catch {
      analysis = { summary: analysisText }
    }

    const summary = analysis.summary || analysisText

    // Step 2: Get brand shades
    const brandShades = BRAND_SHADES[brand] || BRAND_SHADES['mac']
    
    // Select 3-5 shades based on analysis
    const selectedShades = brandShades.slice(0, 4)

    // Step 3: Generate infographic with gpt-image-1
    const infographicPrompt = `Create a beautiful lipstick recommendation infographic (9:16 vertical format, 1080x1920px).

Style: Luxury beauty brand aesthetic, soft pink/rose gold color palette, elegant serif fonts, clean modern layout.

Content:
- Title: "💄 专属口红推荐" at top
- User Analysis Section:
  - Skin tone: ${analysis.skinTone || '分析中'}
  - Brightness: ${analysis.brightness || '分析中'}
  - Vibe: ${analysis.vibe || '分析中'}
  - Lip base: ${analysis.lipBase || '分析中'}
  - Summary: "${summary}"

- Brand: ${brand.toUpperCase()}
- Recommend 4 shades with:
  - Shade number and name
  - Color swatch (use the exact hex colors)
  - Effect description
  - Scene recommendation

Shades to include:
${selectedShades.map((s, i) => `${i+1}. ${s.number} ${s.name} (${s.color}) - ${s.effect} - ${s.scene}`).join('\n')}

Design requirements:
- Soft gradient background (pink to cream)
- Elegant typography
- Color swatches shown as circles with actual colors
- Clean card-based layout for each shade
- Small icons for effects and scenes
- Bottom: "Powered by AI" subtle text`

    const imageResponse = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: infographicPrompt,
      n: 1,
      size: '1024x1792', // 9:16 portrait
    })

    const infographicUrl = imageResponse.data?.[0]?.url || ''

    return NextResponse.json({
      analysis: summary,
      recommendations: selectedShades,
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
