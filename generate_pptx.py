import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation(output_path):
    prs = Presentation()
    # 16:9 widescreen
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette inspired by Khatiib Design System
    C_DARK_BG = RGBColor(3, 29, 24)       # Deep Emerald (#031D18)
    C_DARK_CARD = RGBColor(6, 43, 36)     # Dark Card (#062B24)
    C_DARK_BORDER = RGBColor(18, 70, 60)  # Dark Border
    C_LIGHT_BG = RGBColor(250, 249, 246)  # Warm Paper Ivory (#FAF9F6)
    C_LIGHT_CARD = RGBColor(255, 255, 255)# Pure White Card
    C_LIGHT_BORDER = RGBColor(220, 232, 227) # Soft Emerald Border
    C_EMERALD_PRI = RGBColor(14, 77, 64)  # Primary Emerald (#0E4D40)
    C_EMERALD_LIGHT = RGBColor(232, 243, 239) # Soft Mint Pill (#E8F3EF)
    C_GOLD = RGBColor(197, 168, 128)      # Soft Gold Accent (#C5A880)
    C_GOLD_LIGHT = RGBColor(248, 244, 236)
    C_TEXT_DARK = RGBColor(26, 46, 43)    # Main Body Text
    C_TEXT_MUTED = RGBColor(82, 110, 103) # Muted Text
    C_TEXT_WHITE = RGBColor(245, 247, 246)
    C_TEXT_LIGHT_MUTED = RGBColor(160, 185, 178)
    C_ACCENT_RED = RGBColor(180, 50, 45)  # Alert / Problem Red
    C_ACCENT_RED_BG = RGBColor(253, 242, 242)

    FONT_FAMILY = "Cairo"

    def add_bg(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_top_bar(slide, is_dark=False):
        # Top subtle brand bar
        bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.08))
        bar.fill.solid()
        bar.fill.fore_color.rgb = C_GOLD if is_dark else C_EMERALD_PRI
        bar.line.fill.background()

    def add_header(slide, title_text, category_text, is_dark=False):
        add_top_bar(slide, is_dark)
        
        # Pill badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.5), Inches(0.45), Inches(2.1), Inches(0.42))
        badge.fill.solid()
        badge.fill.fore_color.rgb = C_DARK_CARD if is_dark else C_EMERALD_LIGHT
        badge.line.color.rgb = C_DARK_BORDER if is_dark else C_LIGHT_BORDER
        tf_b = badge.text_frame
        tf_b.word_wrap = True
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        p_b.text = category_text
        p_b.font.name = FONT_FAMILY
        p_b.font.size = Pt(11)
        p_b.font.bold = True
        p_b.font.color.rgb = C_GOLD if is_dark else C_EMERALD_PRI

        # Title text box
        tx_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(9.5), Inches(0.8))
        tf = tx_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.RIGHT
        p.text = title_text
        p.font.name = FONT_FAMILY
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = C_TEXT_WHITE if is_dark else C_EMERALD_PRI

        # Subtle separator line
        sep = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.25), Inches(11.733), Inches(0.02))
        sep.fill.solid()
        sep.fill.fore_color.rgb = C_DARK_BORDER if is_dark else C_LIGHT_BORDER
        sep.line.fill.background()

        # Footer branding
        footer = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(11.733), Inches(0.35))
        tf_f = footer.text_frame
        p_f = tf_f.paragraphs[0]
        p_f.alignment = PP_ALIGN.LEFT
        p_f.text = "منصة خطيب · تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي 2026"
        p_f.font.name = FONT_FAMILY
        p_f.font.size = Pt(9.5)
        p_f.font.color.rgb = C_TEXT_LIGHT_MUTED if is_dark else C_TEXT_MUTED

    # =========================================================================
    # SLIDE 1: COVER
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1, C_DARK_BG)
    add_top_bar(s1, is_dark=True)

    # Decorative Center Card
    c_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(1.0), Inches(10.333), Inches(5.5))
    c_card.fill.solid()
    c_card.fill.fore_color.rgb = C_DARK_CARD
    c_card.line.color.rgb = C_DARK_BORDER

    # Badge: Challenge Name
    ch_badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.8), Inches(1.5), Inches(5.733), Inches(0.5))
    ch_badge.fill.solid()
    ch_badge.fill.fore_color.rgb = RGBColor(10, 56, 47)
    ch_badge.line.color.rgb = C_GOLD
    p = ch_badge.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي 2026"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_GOLD

    # Main Brand Name
    b_box = s1.shapes.add_textbox(Inches(2.0), Inches(2.2), Inches(9.333), Inches(1.3))
    p = b_box.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "مَنَصَّة خَطِيب"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = C_TEXT_WHITE

    # Subtitle
    sub_box = s1.shapes.add_textbox(Inches(2.0), Inches(3.4), Inches(9.333), Inches(1.0))
    p = sub_box.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "ورشة الذكاء الاصطناعي التوليدي لصياغة الخطب المنبرية\nبضوابط شرعية وبلاغة أصيلة"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = RGBColor(163, 230, 210)

    # Slogan / Quote
    sl_box = s1.shapes.add_textbox(Inches(2.0), Inches(4.5), Inches(9.333), Inches(0.6))
    p = sl_box.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "« كلمة تُؤثِر .. وتقنية تُمكّن »"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(15)
    p.font.italic = True
    p.font.color.rgb = C_GOLD

    # Meta Info Footer inside Card
    m_box = s1.shapes.add_textbox(Inches(2.0), Inches(5.3), Inches(9.333), Inches(0.5))
    p = m_box.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "مسار توليد وإثراء المحتوى الإسلامي الرصين · الإصدار التجريبي"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(11)
    p.font.color.rgb = C_TEXT_LIGHT_MUTED

    # =========================================================================
    # SLIDE 2: THE PROBLEM
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2, C_LIGHT_BG)
    add_header(s2, "ثقل أمانة المنبر وتحديات إعداد الخطبة في عصر السرعة", "المشكلة والواقع")

    problems = [
        ("01", "رهبة الصفحة البيضاء وصعوبة التجديد", "يواجه خطيب الجمعة أسبوعياً معضلة البدء من الصفر لاختيار موضوع يلامس هموم المصلين الحقيقية، مما يدفع الكثيرين للاستنساخ الحرفي للخطب القديمة أو الوقوع في التكرار النمطي.", C_EMERALD_PRI),
        ("02", "استنزاف 4 إلى 6 ساعات في البحث والتحضير", "يقضي الخطيب ساعات طويلة ومجهدة أسبوعياً بين جمع الشواهد، وتخريج الأحاديث، وتنسيق الأفكار، مما يثقل كاهله ويقلل من وقت التفرغ للحفظ والاستحضار والاتصال الروحي بالمصلين.", C_GOLD),
        ("03", "تشتت المصادر وضعف التوثيق الحديثي", "فوضى المراجع بين مواقع الإنترنت، والكتب غير المحققة، ومخاطر الوقوع في إيراد أحاديث ضعيفة أو قصص موضوعة متداولة لا تصح نسبتها إلى النبي ﷺ.", C_ACCENT_RED)
    ]

    card_w = Inches(3.7)
    gap = Inches(0.3)
    start_x = Inches(0.8)

    for i, (num, h_text, b_text, accent_c) in enumerate(problems):
        cx = start_x + i * (card_w + gap)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(1.7), card_w, Inches(5.0))
        card.fill.solid()
        card.fill.fore_color.rgb = C_LIGHT_CARD
        card.line.color.rgb = C_LIGHT_BORDER

        # Top Accent line
        top_acc = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, cx, Inches(1.7), card_w, Inches(0.08))
        top_acc.fill.solid()
        top_acc.fill.fore_color.rgb = accent_c
        top_acc.line.fill.background()

        # Number Badge
        nb = s2.shapes.add_shape(MSO_SHAPE.OVAL, cx + Inches(0.3), Inches(2.0), Inches(0.7), Inches(0.7))
        nb.fill.solid()
        nb.fill.fore_color.rgb = C_EMERALD_LIGHT
        nb.line.color.rgb = C_LIGHT_BORDER
        p = nb.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = num
        p.font.name = FONT_FAMILY
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = C_EMERALD_PRI

        # Header
        th = s2.shapes.add_textbox(cx + Inches(0.3), Inches(2.8), card_w - Inches(0.6), Inches(1.0))
        tf = th.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.RIGHT
        p.text = h_text
        p.font.name = FONT_FAMILY
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = C_TEXT_DARK

        # Body
        tb = s2.shapes.add_textbox(cx + Inches(0.3), Inches(3.8), card_w - Inches(0.6), Inches(2.6))
        tf_b = tb.text_frame
        tf_b.word_wrap = True
        p = tf_b.paragraphs[0]
        p.alignment = PP_ALIGN.RIGHT
        p.text = b_text
        p.font.name = FONT_FAMILY
        p.font.size = Pt(12)
        p.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 3: THE GAP IN GENERIC AI
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3, C_LIGHT_BG)
    add_header(s3, "لماذا تفشل نماذج الذكاء الاصطناعي العامة على المنبر؟", "الفجوة والقصور")

    gaps = [
        ("الهلوسة الشرعية ونسبة الأحاديث الضعيفة", "النماذج العامة تبتدع متوناً غير صحيحة، أو تنسب أحاديث موضوعة أو مكذوبة إلى كتب الصحاح دون أي حياء علمي، والمنبر لا يحتمل الخطأ الشرعي."),
        ("الركاكة والأسلوب الصحفي المترجم", "تعتمد النماذج لغة مترجمة مليئة بالكليشيهات الباردة مثل: 'يلعب دوراً رئيسياً'، 'يسلط الضوء'، 'في هذا العصر'، وهي لغة هزيلة تفقد المنبر جلاله وهيبته."),
        ("انعدام مراعاة أزمنة وهيكل الخطبة المنبرية", "تولد نصوصاً إنشائية هلامية بلا ضوابط زمنية، ولا تفرق بين خطبة أولى، واستراحة، وخطبة ثانية، وخاتمة بالدعاء المأثور."),
        ("انتهاك سرية الأفكار والمسودات المنبرية", "المنصات العامة ترفع أفكار الخطباء على خوادمها لتدريب نماذجها، مما يقلق الإمام حيال خصوصية أفكاره المنبرية قبل إلقائها.")
    ]

    for idx, (title_g, desc_g) in enumerate(gaps):
        gy = Inches(1.6) + idx * Inches(1.25)
        box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), gy, Inches(11.733), Inches(1.1))
        box.fill.solid()
        box.fill.fore_color.rgb = C_LIGHT_CARD
        box.line.color.rgb = C_LIGHT_BORDER

        # Alert marker on right
        am = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(12.35), gy + Inches(0.2), Inches(0.08), Inches(0.7))
        am.fill.solid()
        am.fill.fore_color.rgb = C_ACCENT_RED
        am.line.fill.background()

        # Text
        tx = s3.shapes.add_textbox(Inches(1.0), gy + Inches(0.12), Inches(11.2), Inches(0.85))
        tf = tx.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.alignment = PP_ALIGN.RIGHT
        p1.text = "⚠️  " + title_g
        p1.font.name = FONT_FAMILY
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = C_TEXT_DARK

        p2 = tf.add_paragraph()
        p2.alignment = PP_ALIGN.RIGHT
        p2.text = desc_g
        p2.font.name = FONT_FAMILY
        p2.font.size = Pt(11.5)
        p2.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 4: THE SOLUTION - KHATIIB
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4, C_LIGHT_BG)
    add_header(s4, "منصة خطيب: ورشة عمل ذكية تمكّن الخطيب ولا تستبدله", "الحل المبتكر")

    # Banner quote
    q_card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(0.9))
    q_card.fill.solid()
    q_card.fill.fore_color.rgb = C_EMERALD_LIGHT
    q_card.line.color.rgb = C_LIGHT_BORDER
    p = q_card.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "« المنصة أداة مساعدة لكسر جمود الصفحة البيضاء، وليست بديلاً عن بصيرة الخطيب وفقهه لواقع جماعته »"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD_PRI

    sol_cards = [
        ("ورشة صياغة تفاعلية موجَّهة", "مسار مدروس خطوة بخطوة يمنع التشتت ويحول الفكرة العابرة إلى هيكل متماسك، مع تحديد دقيق للجمهور والنبرة ومحاور الخطبة."),
        ("محرك التحقق الحديثي الصارم", "تكامل مباشر مع محركات التخريج مثل (Hdith.com)، وحظر تام لإيراد الأحاديث الضعيفة أو الموضوعة لضمان أمانة المنبر."),
        ("طبقة التنقية والتعريب البلاغي", "خوارزمية حصرية (Humanizer) تنقي المسودة آلياً من كليشيهات الذكاء الاصطناعي وتصيغها ببيان عربي فصيح يليق بقدسية المنبر."),
        ("الخصوصية الكاملة والتصدير الفوري", "تخزين محلي آمن في متصفح الخطيب دون إرسال مسوداته لأي خوادم خارجية، مع تصدير مباشر إلى ملف Word (docx) جاهز للقراءة.")
    ]

    for idx, (title_s, desc_s) in enumerate(sol_cards):
        row = idx // 2
        col = idx % 2
        cx = Inches(0.8) + (1 - col) * Inches(5.95)
        cy = Inches(2.6) + row * Inches(2.1)

        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, cy, Inches(5.75), Inches(1.9))
        card.fill.solid()
        card.fill.fore_color.rgb = C_LIGHT_CARD
        card.line.color.rgb = C_LIGHT_BORDER

        # Pill marker
        pill = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx + Inches(5.0), cy + Inches(0.2), Inches(0.5), Inches(0.5))
        pill.fill.solid()
        pill.fill.fore_color.rgb = C_EMERALD_LIGHT
        pill.line.color.rgb = C_LIGHT_BORDER
        p = pill.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = "✓"
        p.font.name = FONT_FAMILY
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = C_EMERALD_PRI

        tx = s4.shapes.add_textbox(cx + Inches(0.3), cy + Inches(0.15), Inches(4.6), Inches(1.6))
        tf = tx.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.alignment = PP_ALIGN.RIGHT
        p1.text = title_s
        p1.font.name = FONT_FAMILY
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = C_EMERALD_PRI

        p2 = tf.add_paragraph()
        p2.alignment = PP_ALIGN.RIGHT
        p2.text = desc_s
        p2.font.name = FONT_FAMILY
        p2.font.size = Pt(11)
        p2.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 5: USER JOURNEY / WORKSHOP FLOW
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5, C_LIGHT_BG)
    add_header(s5, "رحلة إعداد الخطبة: من الفكرة العابرة إلى المسودة في 5 خطوات", "مسار الورشة")

    steps = [
        ("1", "تحديد النوع والموضوع", "اختيار القالب (خطبة جمعة / كلمة موعظية / درس) وكتابة موضوع الخطبة"),
        ("2", "تخصيص الجمهور", "تحديد الفئة: عامة المصلين، الشباب، أهل الحي، الناشئة لمطابقة لغة الخطاب"),
        ("3", "ضبط النبرة والمدة", "اختيار النبرة (وعظي مؤثر، علمي، علاجي) وتحديد زمن الإلقاء (15-25 دقيقة)"),
        ("4", "هندسة المحاور", "بناء محاور الخطبة وتوزيع الأفكار بموازنة منهجية بين الترغيب والترهيب"),
        ("5", "التوليد والمراجعة", "صياغة المسودة بالتوازي، فحص الأحاديث، وتصدير ملف Word جاهز للإلقاء")
    ]

    card_w5 = Inches(2.2)
    gap5 = Inches(0.18)
    start_x5 = Inches(0.8)

    for i, (num, h_text, b_text) in enumerate(steps):
        col_idx = 4 - i
        cx = start_x5 + col_idx * (card_w5 + gap5)

        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(1.8), card_w5, Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = C_LIGHT_CARD
        card.line.color.rgb = C_LIGHT_BORDER

        # Step badge
        sb = s5.shapes.add_shape(MSO_SHAPE.OVAL, cx + Inches(0.75), Inches(2.1), Inches(0.7), Inches(0.7))
        sb.fill.solid()
        sb.fill.fore_color.rgb = C_EMERALD_PRI if i == 4 else C_EMERALD_LIGHT
        sb.line.color.rgb = C_LIGHT_BORDER
        p = sb.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = num
        p.font.name = FONT_FAMILY
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = C_TEXT_WHITE if i == 4 else C_EMERALD_PRI

        # Header
        th = s5.shapes.add_textbox(cx + Inches(0.15), Inches(3.0), card_w5 - Inches(0.3), Inches(1.0))
        tf = th.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = h_text
        p.font.name = FONT_FAMILY
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = C_TEXT_DARK

        # Body
        tb = s5.shapes.add_textbox(cx + Inches(0.15), Inches(4.1), card_w5 - Inches(0.3), Inches(2.3))
        tf_b = tb.text_frame
        tf_b.word_wrap = True
        p = tf_b.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = b_text
        p.font.name = FONT_FAMILY
        p.font.size = Pt(10.5)
        p.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 6: DEEP TECH & ISLAMIC GROUNDING
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6, C_LIGHT_BG)
    add_header(s6, "الابتكار التقني: محرك التخريج والتعريب البلاغي التراثي", "الابتكار التقني")

    pillars = [
        ("محرك التخريج والتحقق الحديثي", "Takhrij & Grounding Engine", "توجيه قطعي للنماذج بحظر الأحاديث الضعيفة أو الموضوعة، مع ربط مخصص بـ (Hdith Proxy API) للبحث في صحة الرواية وعزوها مباشرة لراويها ومخرجها.", C_EMERALD_PRI),
        ("منقي الأسلوب التراثي العربي", "Classical Arabic Humanizer", "خوارزمية معالجة لاحقة (Post-processing) تستبدل الكليشيهات الحديثة والمترجمة بألفاظ عربية فصيحة (كالاستعاضة عن 'يسلط الضوء' بـ 'يجلو المعنى'، وعن 'يلعب دوراً' بـ 'كان له أثرٌ').", C_GOLD),
        ("التوليد المتوازي للمحاور", "Concurrent Section Workers", "بنية توليد متزامنة تقسم الخطبة إلى محاور متوازية، مما يقلص زمن التوليد من دقيقتين إلى أقل من 20 ثانية مع الحفاظ على حساب دقيق لسرعة الإلقاء وعدد الكلمات.", C_EMERALD_PRI)
    ]

    card_w6 = Inches(3.7)
    gap6 = Inches(0.3)
    start_x6 = Inches(0.8)

    for i, (ar_t, en_t, desc_p, col_bar) in enumerate(pillars):
        cx = start_x6 + i * (card_w6 + gap6)
        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(1.7), card_w6, Inches(5.0))
        card.fill.solid()
        card.fill.fore_color.rgb = C_LIGHT_CARD
        card.line.color.rgb = C_LIGHT_BORDER

        top_b = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, cx, Inches(1.7), card_w6, Inches(0.08))
        top_b.fill.solid()
        top_b.fill.fore_color.rgb = col_bar
        top_b.line.fill.background()

        tx = s6.shapes.add_textbox(cx + Inches(0.25), Inches(2.0), card_w6 - Inches(0.5), Inches(1.2))
        tf = tx.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.alignment = PP_ALIGN.RIGHT
        p1.text = ar_t
        p1.font.name = FONT_FAMILY
        p1.font.size = Pt(14.5)
        p1.font.bold = True
        p1.font.color.rgb = C_TEXT_DARK

        p2 = tf.add_paragraph()
        p2.alignment = PP_ALIGN.RIGHT
        p2.text = en_t
        p2.font.name = "Segoe UI"
        p2.font.size = Pt(10)
        p2.font.color.rgb = C_GOLD

        tb = s6.shapes.add_textbox(cx + Inches(0.25), Inches(3.3), card_w6 - Inches(0.5), Inches(3.2))
        tf_b = tb.text_frame
        tf_b.word_wrap = True
        p = tf_b.paragraphs[0]
        p.alignment = PP_ALIGN.RIGHT
        p.text = desc_p
        p.font.name = FONT_FAMILY
        p.font.size = Pt(12)
        p.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 7: ARCHITECTURE & TECH STACK
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7, C_LIGHT_BG)
    add_header(s7, "المعمارية التقنية: سرعة فائقة وحوسبة حافة متقدمة", "المعمارية التقنية")

    tech_items = [
        ("الواجهة وتجربة المستخدم", "React 19 + TanStack Router", "واجهة أمامية فائقة السلاسة مبنية بمكتبة Radix UI و Tailwind CSS v4، متوافقة بالكامل مع الأجهزة اللوحية والمحمولة، مع دعم كامل للوضع الليلي ومواقيت الصلاة الحية."),
        ("نماذج الذكاء الاصطناعي", "Google Gemini & OpenRouter", "تنسيق متقدم مع Gemini 2.5 Flash / Pro و Gemini 3.5، مع نظام Fallback ذكي ومتعدد المستويات يضمن استمرارية الخدمة بنسبة 99.9% في أصعب أوقات الذروة أسبوعياً."),
        ("الحوسبة الطرفية السريعة", "Cloudflare Workers & Pages", "خوادم طرفية موزعة حول العالم عبر شبكة Cloudflare لتقديم استجابة فورية وحماية تامة لمفاتيح الواجهات البرمجية وتشفير الاتصال."),
        ("الخصوصية والتخزين المحلي", "IndexedDB Client Storage", "تخزين مسودات الخطب محلياً بالكامل على متصفح الخطيب دون إرسالها إلى قواعد بيانات سحابية مركزية، حمايةً لقدسية مسودات الإمام وأفكاره قبل المنبر.")
    ]

    for idx, (title_t, tech_t, desc_t) in enumerate(tech_items):
        row = idx // 2
        col = idx % 2
        cx = Inches(0.8) + (1 - col) * Inches(5.95)
        cy = Inches(1.7) + row * Inches(2.55)

        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, cy, Inches(5.75), Inches(2.35))
        card.fill.solid()
        card.fill.fore_color.rgb = C_LIGHT_CARD
        card.line.color.rgb = C_LIGHT_BORDER

        tx = s7.shapes.add_textbox(cx + Inches(0.3), cy + Inches(0.2), Inches(5.15), Inches(1.9))
        tf = tx.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.alignment = PP_ALIGN.RIGHT
        p1.text = title_t + "  |  " + tech_t
        p1.font.name = FONT_FAMILY
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = C_EMERALD_PRI

        p2 = tf.add_paragraph()
        p2.alignment = PP_ALIGN.RIGHT
        p2.text = desc_t
        p2.font.name = FONT_FAMILY
        p2.font.size = Pt(11)
        p2.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 8: IMPACT & METRICS
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_bg(s8, C_LIGHT_BG)
    add_header(s8, "قياس الأثر: نقلة نوعية في كفاءة وموثوقية الخطاب المنبري", "الأثر والنتائج")

    metrics = [
        ("85%", "توفير في وقت التحضير", "تقليص زمن إعداد مسودة الخطبة من 4 ساعات إلى أقل من 15 دقيقة، ليتفرغ الخطيب للحفظ والمدارسة."),
        ("100%", "دقة الشواهد الحديثية", "صفر أحاديث موضوعة أو مجهولة بفضل الحظر الصارم والربط بمحركات التحقق الحديثي المعتمدة."),
        ("20 ث", "زمن التوليد الكامل", "سرعة استجابة مذهلة في صياغة المحاور والمقدمة والخاتمة بفضل المعمارية المتوازية للذكاء الاصطناعي."),
        (".DOCX", "جاهزية الطباعة الفورية", "تصدير فوري لملف Word بهوامش عريضة وخطوط مشكولة وواضحة مخصصة للقراءة على المنبر.")
    ]

    card_w8 = Inches(2.75)
    gap8 = Inches(0.24)
    start_x8 = Inches(0.8)

    for i, (val, h_text, b_text) in enumerate(metrics):
        cx = start_x8 + i * (card_w8 + gap8)
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(1.8), card_w8, Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = C_LIGHT_CARD
        card.line.color.rgb = C_LIGHT_BORDER

        nb = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx + Inches(0.25), Inches(2.1), card_w8 - Inches(0.5), Inches(1.2))
        nb.fill.solid()
        nb.fill.fore_color.rgb = C_EMERALD_LIGHT
        nb.line.color.rgb = C_LIGHT_BORDER
        p = nb.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = val
        p.font.name = FONT_FAMILY
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = C_EMERALD_PRI

        th = s8.shapes.add_textbox(cx + Inches(0.2), Inches(3.5), card_w8 - Inches(0.4), Inches(0.8))
        tf = th.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = h_text
        p.font.name = FONT_FAMILY
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.color.rgb = C_TEXT_DARK

        tb = s8.shapes.add_textbox(cx + Inches(0.2), Inches(4.4), card_w8 - Inches(0.4), Inches(2.0))
        tf_b = tb.text_frame
        tf_b.word_wrap = True
        p = tf_b.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = b_text
        p.font.name = FONT_FAMILY
        p.font.size = Pt(11)
        p.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 9: ROADMAP
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_bg(s9, C_LIGHT_BG)
    add_header(s9, "خارطة الطريق: التوسع المستقبلي في خدمة الدعوة والمنبر", "خارطة الطريق")

    stages = [
        ("المرحلة الأولى (الحالية)", "الورشة الأساسية وتخريج الأحاديث", "✓ إطلاق ورشة صياغة المسودة بـ 5 خطوات\n✓ محرك الفرز الحديثي وربط Hdith API\n✓ طبقة التعريب البلاغي (Humanizer)\n✓ تصدير مستندات Word جاهزة للإلقاء"),
        ("المرحلة الثانية (القادمة)", "محرك RAG للتراث الفقهي", "• ربط أمهات كتب التفسير وموسوعات الفقه\n• مكتبة استشهاد بآثار الصحابة والتابعين\n• حسابات خطباء سحابية مشفرة بالكامل\n• أرشيف ذكي لربط الخطب بالمناسبات السنوية"),
        ("المرحلة الثالثة (المستقبلية)", "المدرب الصوتي وتطبيق المنبر", "• تحليل نبرة وسرعة الإلقاء وتدريب الخطيب صوتياً\n• تطبيق لوحي مخصص للمنبر (Teleprompter)\n• نمط الإلقاء المباشر مع ضبط التمرير بالعين\n• إحصائيات تفاعل واستيعاب المصلين")
    ]

    card_w9 = Inches(3.7)
    gap9 = Inches(0.3)
    start_x9 = Inches(0.8)

    for i, (h_text, sub_t, b_text) in enumerate(stages):
        cx = start_x9 + i * (card_w9 + gap9)
        card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(1.7), card_w9, Inches(5.0))
        card.fill.solid()
        card.fill.fore_color.rgb = C_LIGHT_CARD
        card.line.color.rgb = C_LIGHT_BORDER

        top_b = s9.shapes.add_shape(MSO_SHAPE.RECTANGLE, cx, Inches(1.7), card_w9, Inches(0.08))
        top_b.fill.solid()
        top_b.fill.fore_color.rgb = C_EMERALD_PRI if i == 0 else (C_GOLD if i == 1 else C_DARK_BORDER)
        top_b.line.fill.background()

        tx = s9.shapes.add_textbox(cx + Inches(0.25), Inches(2.0), card_w9 - Inches(0.5), Inches(1.2))
        tf = tx.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.alignment = PP_ALIGN.RIGHT
        p1.text = h_text
        p1.font.name = FONT_FAMILY
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = C_EMERALD_PRI if i == 0 else C_TEXT_DARK

        p2 = tf.add_paragraph()
        p2.alignment = PP_ALIGN.RIGHT
        p2.text = sub_t
        p2.font.name = FONT_FAMILY
        p2.font.size = Pt(11)
        p2.font.color.rgb = C_GOLD

        tb = s9.shapes.add_textbox(cx + Inches(0.25), Inches(3.3), card_w9 - Inches(0.5), Inches(3.2))
        tf_b = tb.text_frame
        tf_b.word_wrap = True
        p = tf_b.paragraphs[0]
        p.alignment = PP_ALIGN.RIGHT
        p.text = b_text
        p.font.name = FONT_FAMILY
        p.font.size = Pt(11.5)
        p.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 10: CONCLUSION & VISION
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_bg(s10, C_DARK_BG)
    add_top_bar(s10, is_dark=True)

    c_card10 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(1.0), Inches(10.333), Inches(5.5))
    c_card10.fill.solid()
    c_card10.fill.fore_color.rgb = C_DARK_CARD
    c_card10.line.color.rgb = C_DARK_BORDER

    # Quranic verse
    q_box = s10.shapes.add_textbox(Inches(2.0), Inches(1.6), Inches(9.333), Inches(1.2))
    p = q_box.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "﴿ وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ وَعَمِلَ صَالِحًا وَقَالَ إِنَّنِي مِنَ الْمُسْلِمِينَ ﴾"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_GOLD

    # Title
    t10_box = s10.shapes.add_textbox(Inches(2.0), Inches(2.9), Inches(9.333), Inches(1.0))
    p = t10_box.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "معاً لتمكين خطيب الجمعة ليُنير دروب المجتمع"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(26)
    p.font.bold = True
    p.font.color.rgb = C_TEXT_WHITE

    # Summary
    s10_box = s10.shapes.add_textbox(Inches(2.5), Inches(3.9), Inches(8.333), Inches(1.2))
    tf10 = s10_box.text_frame
    tf10.word_wrap = True
    p = tf10.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "«منصة خطيب» تسخر أحدث تقنيات الذكاء الاصطناعي لحفظ هيبة المنبر النبوي، وصيانة الكلمة الدعوية من الدخيل والضعيف، وتقديم أداة مساعدة تحفظ وقت الإمام وترتقي بأثره في الناس."
    p.font.name = FONT_FAMILY
    p.font.size = Pt(13)
    p.font.color.rgb = RGBColor(163, 230, 210)

    # CTA Pill
    cta = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.5), Inches(5.3), Inches(4.333), Inches(0.65))
    cta.fill.solid()
    cta.fill.fore_color.rgb = C_EMERALD_PRI
    cta.line.color.rgb = C_GOLD
    p = cta.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "شكراً لكم · نسعد بتقييمكم وملاحظاتكم"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_TEXT_WHITE

    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    import sys
    out_file = sys.argv[1] if len(sys.argv) > 1 else "khatiib_presentation.pptx"
    create_presentation(out_file)
