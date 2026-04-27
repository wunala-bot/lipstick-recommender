import { NextRequest, NextResponse } from 'next/server'

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

    const brandName = BRAND_NAMES[brand] || brand

    // Build the prompt with user's exact template
    const prompt = `你是一个高端美妆顾问 + 信息结构设计系统，

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

————————————

设计要求：
· 9:16竖版信息图，1080x1920px
· 奢侈品美妆品牌美学，柔和的粉色/玫瑰金色调
· 优雅衬线字体，干净现代布局
· 柔和渐变背景（粉色到奶油色）
· 色块用圆形展示实际颜色
· 卡片式布局展示每个色号
· 底部 subtle "Powered by AI" 文字`

    // Call Doubao image generation API with image-to-image
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DOUBAO_API_KEY || ''}`,
      },
      body: JSON.stringify({
        model: 'doubao-seedream-4-5-251128',
        prompt: prompt,
        image: image,  // 用户上传的照片作为参考
        sequential_image_generation: 'disabled',
        response_format: 'url',
        size: '2K',
        stream: false,
        watermark: true,
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`图片生成失败: ${errorData}`)
    }

    const data = await response.json()
    const infographicUrl = data.data?.[0]?.url || ''

    // Also get text analysis by calling chat completions with the image
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
            content: '你是一个高端美妆顾问。请分析用户自拍照片，输出肤色、气质和适合的口红色系。'
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: `请分析这张照片，推荐适合${brandName}的口红色号。输出JSON格式：{"skinTone":"冷调/暖调/中性","brightness":"白皙/自然/偏深","vibe":"清冷/温柔/成熟/明艳/氛围感","lipBase":"描述","summary":"该用户适合：{色系} + {明度} + {风格} 的口红","recommendations":[{"number":"色号","name":"色系名称","effect":"上脸效果","scene":"适用场景","color":"#HEX"}]}` },
              { type: 'image_url', image_url: { url: image } }
            ]
          }
        ],
        max_tokens: 2000,
      })
    })

    let analysis: any = {}
    let recommendations: any[] = []

    if (analysisResponse.ok) {
      const analysisData = await analysisResponse.json()
      const analysisText = analysisData.choices?.[0]?.message?.content || ''
      
      try {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0])
          recommendations = analysis.recommendations || []
        }
      } catch {
        analysis = { summary: analysisText }
      }
    }

    const summary = analysis.summary || '根据您的肤色气质，为您推荐以下口红色号'

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
