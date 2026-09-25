import json
import os

data = {
  "ox_restriction": [
    {
      "en": "Due to budget restrictions, we had to postpone the launch of the new advertising campaign until next quarter.",
      "th": "เนื่องจากข้อจำกัดด้านงบประมาณ เราจึงต้องเลื่อนการเปิดตัวแคมเปญโฆษณาใหม่ออกไปเป็นไตรมาสหน้า",
      "context": "work"
    },
    {
      "en": "The airline has a strict luggage weight restriction of twenty kilograms per passenger.",
      "th": "สายการบินมีข้อกำหนดจำกัดน้ำหนักสัมภาระอย่างเข้มงวดไม่เกินยี่สิบกิโลกรัมต่อผู้โดยสารหนึ่งคน",
      "context": "general"
    }
  ],
  "ox_result": [
    {
      "en": "The marketing team gathered to analyze the quarterly campaign results and see which channels performed best.",
      "th": "ทีมการตลาดรวมตัวกันเพื่อวิเคราะห์ผลลัพธ์ของแคมเปญประจำไตรมาส และดูว่าช่องทางไหนทำผลงานได้ดีที่สุด",
      "context": "work"
    },
    {
      "en": "I took a blood test yesterday, and the doctor said the results should be ready by Friday afternoon.",
      "th": "ฉันไปตรวจเลือดมาเมื่อวาน คุณหมอบอกว่าผลตรวจน่าจะได้ช่วงบ่ายวันศุกร์นี้",
      "context": "general"
    }
  ],
  "ox_result_in": [
    {
      "en": "Poor communication between the sales and tech teams could result in costly project delays.",
      "th": "การสื่อสารที่ไม่ดีระหว่างทีมขายกับทีมไอทีอาจส่งผลให้โปรเจกต์ล่าช้าและสิ้นเปลืองงบประมาณได้",
      "context": "work"
    },
    {
      "en": "Skipping meals and staying up late often results in serious health problems down the road.",
      "th": "การอดอาหารและนอนดึกเป็นประจำมักส่งผลเสียต่อสุขภาพอย่างรุนแรงในระยะยาว",
      "context": "general"
    }
  ],
  "ox_retain": [
    {
      "en": "The company introduced flexible working hours in an effort to retain talented software engineers.",
      "th": "บริษัทได้นำระบบเวลาทำงานที่ยืดหยุ่นมาใช้เพื่อรักษาพนักงานฝ่ายวิศวกรรมซอฟต์แวร์ที่มีความสามารถเอาไว้",
      "context": "work"
    },
    {
      "en": "Even into his eighties, my grandfather managed to retain a sharp memory and a great sense of humor.",
      "th": "แม้จะอายุแปดสิบกว่าปีแล้ว คุณตาของฉันก็ยังคงรักษาความจำที่เฉียบคมและอารมณ์ขันที่ยอดเยี่ยมไว้ได้",
      "context": "general"
    }
  ],
  "ox_retire": [
    {
      "en": "Our head of finance decided to retire after dedicating more than thirty years to the company.",
      "th": "หัวหน้าฝ่ายการเงินของเราตัดสินใจเกษียณอายุหลังทุ่มเททำงานให้กับบริษัทมานานกว่าสามสิบปี",
      "context": "work"
    },
    {
      "en": "My parents plan to sell their city condo and retire to a quiet coastal town down south.",
      "th": "พ่อแม่ของฉันวางแผนจะขายคอนโดในเมือง แล้วย้ายไปใช้ชีวิตวัยเกษียณที่เมืองชายทะเลอันเงียบสงบทางภาคใต้",
      "context": "general"
    }
  ],
  "ox_retired": [
    {
      "en": "We hired a retired accountant on a part-time consulting basis to help us with the year-end audit.",
      "th": "เราว่าจ้างนักบัญชีที่เกษียณแล้วมารับหน้าที่เป็นที่ปรึกษาพาร์ตไทม์เพื่อช่วยตรวจสอบบัญชีสิ้นปี",
      "context": "work"
    },
    {
      "en": "My uncle is a retired high school principal who now spends most of his mornings birdwatching.",
      "th": "ลุงของฉันเป็นอดีตครูใหญ่โรงเรียนมัธยมที่เกษียณแล้ว ตอนนี้ใช้เวลาช่วงเช้าส่วนใหญ่ไปกับการดูนก",
      "context": "general"
    }
  ],
  "ox_retirement": [
    {
      "en": "The HR department held a seminar on smart investment options for our corporate retirement fund.",
      "th": "ฝ่ายบุคคลจัดสัมมนาเกี่ยวกับการเลือกกองทุนสำรองเลี้ยงชีพเพื่อวางแผนการเงินวัยเกษียณอย่างชาญฉลาด",
      "context": "work"
    },
    {
      "en": "She threw a memorable retirement party at her home to celebrate the end of a long, fulfilling career.",
      "th": "เธอจัดงานเลี้ยงฉลองเกษียณอย่างน่าประทับใจที่บ้าน เพื่อส่งท้ายชีวิตการทำงานอันยาวนานและน่าภาคภูมิใจ",
      "context": "general"
    }
  ],
  "ox_return": [
    {
      "en": "Please make sure you return the company laptop and access badge to HR on your last working day.",
      "th": "กรุณาส่งคืนแล็ปท็อปของบริษัทและบัตรพนักงานให้ฝ่ายบุคคลในวันทำงานวันสุดท้ายของคุณด้วยนะ",
      "context": "work"
    },
    {
      "en": "I will return from my vacation in Japan late Sunday night, so let's catch up over coffee next week.",
      "th": "ฉันจะกลับจากเที่ยวญี่ปุ่นดึกๆ คืนวันอาทิตย์ ไว้สัปดาห์หน้าเราค่อยนัดดื่มกาแฟคุยกันนะ",
      "context": "general"
    }
  ],
  "ox_reveal": [
    {
      "en": "The tech firm held a live event yesterday to reveal the design and key features of their next flagship phone.",
      "th": "เมื่อวานนี้บริษัทเทคโนโลยีได้จัดงานถ่ายทอดสดเพื่อเปิดเผยดีไซน์และฟีเจอร์เด่นของสมาร์ตโฟนรุ่นเรือธงตัวใหม่",
      "context": "work"
    },
    {
      "en": "The detective refused to reveal any details about the suspect until the formal investigation was concluded.",
      "th": "ตำรวจสืบสวนปฏิเสธที่จะเปิดเผยรายละเอียดใดๆ เกี่ยวกับผู้ต้องสงสัยจนกว่าการสอบสวนอย่างเป็นทางการจะเสร็จสิ้น",
      "context": "general"
    }
  ],
  "ox_reverse": [
    {
      "en": "The board decided to reverse its earlier decision and approve the budget increase for research and development.",
      "th": "คณะกรรมการบริหารตัดสินใจกลับคำตัดสินใจเดิม และอนุมัติการเพิ่มงบประมาณสำหรับการวิจัยและพัฒนา",
      "context": "work"
    },
    {
      "en": "Be extra careful when you reverse your car out of the driveway because neighborhood kids often ride bikes around here.",
      "th": "ระวังให้ดีเวลาถอยรถออกจากโรงรถนะ เพราะเด็กแถวนี้มักจะปั่นจักรยานเล่นกันประจำ",
      "context": "general"
    }
  ],
  "ox_review": [
    {
      "en": "During our annual performance review, my manager highlighted my leadership skills and discussed my promotion path.",
      "th": "ในช่วงการประเมินผลงานประจำปี ผู้จัดการได้เอ่ยชมทักษะความเป็นผู้นำของฉันและพูดคุยถึงโอกาสในการเลื่อนตำแหน่ง",
      "context": "work"
    },
    {
      "en": "Before booking that seaside hotel, I read several customer reviews online to make sure the rooms were clean.",
      "th": "ก่อนจะจองโรงแรมริมทะเลแห่งนั้น ฉันอ่านรีวิวจากลูกค้าหลายคนบนอินเทอร์เน็ตเพื่อให้แน่ใจว่าห้องพักสะอาดจริง",
      "context": "general"
    }
  ],
  "ox_revise": [
    {
      "en": "We need to revise the contract terms before sending the final draft to the legal department.",
      "th": "เราจำเป็นต้องแก้ไขข้อกำหนดในสัญญาก่อนที่จะส่งร่างฉบับสมบูรณ์ไปให้ฝ่ายกฎหมาย",
      "context": "work"
    },
    {
      "en": "He spent the whole weekend revising his thesis chapters based on his advisor's detailed feedback.",
      "th": "เขาใช้เวลาตลอดทั้งวันหยุดสุดสัปดาห์ไปกับการปรับแก้บทต่างๆ ในวิทยานิพนธ์ตามคำแนะนำอย่างละเอียดของอาจารย์ที่ปรึกษา",
      "context": "general"
    }
  ],
  "ox_revision": [
    {
      "en": "The client requested a few minor revisions to the website layout before giving their final sign-off.",
      "th": "ลูกค้าขอให้ปรับแก้งานออกแบบเลย์เอาต์หน้าเว็บไซต์เล็กน้อยก่อนจะเซ็นอนุมัติขั้นสุดท้าย",
      "context": "work"
    },
    {
      "en": "After several revisions, her first novel was finally accepted by a reputable publishing house.",
      "th": "หลังผ่านการแก้ไขปรับปรุงมาหลายรอบ ในที่สุดนวนิยายเล่มแรกของเธอก็ได้รับการตอบรับจากสำนักพิมพ์ชั้นนำ",
      "context": "general"
    }
  ],
  "ox_revolution": [
    {
      "en": "The rapid adoption of artificial intelligence has sparked a revolution in workplace productivity and automation.",
      "th": "การนำปัญญาประดิษฐ์มาใช้อย่างรวดเร็วได้จุดประกายให้เกิดการปฏิวัติประสิทธิภาพการทำงานและระบบอัตโนมัติในองค์กร",
      "context": "work"
    },
    {
      "en": "The invention of smartphones brought about a digital revolution in how people connect and share information daily.",
      "th": "การคิดค้นสมาร์ตโฟนขึ้นมาได้สร้างการปฏิวัติดิจิทัลในวิถีที่ผู้คนใช้ติดต่อสื่อสารและแบ่งปันข้อมูลกันในแต่ละวัน",
      "context": "general"
    }
  ],
  "ox_reward": [
    {
      "en": "Our sales department offers an attractive financial bonus as a reward for hitting quarterly targets early.",
      "th": "แผนกฝ่ายขายของเรามีโบนัสการเงินที่น่าดึงดูดใจเป็นรางวัลสำหรับคนที่ทำยอดขายทะลุเป้าประจำไตรมาสได้ล่วงหน้า",
      "context": "work"
    },
    {
      "en": "After finishing a grueling ten-kilometer run, she bought herself an iced latte as a small reward.",
      "th": "หลังจากวิ่งระยะทางสิบกิโลเมตรสุดเหน็ดเหนื่อยเสร็จ เธอซื้อลาเต้เย็นให้ตัวเองเป็นรางวัลเล็กๆ น้อยๆ",
      "context": "general"
    }
  ],
  "ox_rhythm": [
    {
      "en": "Once our team settled into a steady work rhythm, we began finishing sprints well ahead of the deadline.",
      "th": "พอทีมเราเริ่มจับจังหวะการทำงานที่คงที่และลงตัวได้ เราก็เริ่มส่งมอบงานในแต่ละสปรินต์ได้เสร็จก่อนกำหนดอย่างสบายๆ",
      "context": "work"
    },
    {
      "en": "The rhythmic sound of waves gently lapping against the shore helped me unwind and fall asleep quickly.",
      "th": "เสียงคลื่นกระทบฝั่งเป็นจังหวะเบาๆ ชวนให้รู้สึกผ่อนคลายและเคลิ้มหลับไปอย่างรวดเร็ว",
      "context": "general"
    }
  ],
  "ox_rice": [
    {
      "en": "The agricultural enterprise signed an export deal to ship five thousand tons of organic jasmine rice overseas.",
      "th": "บริษัทส่งออกสินค้าเกษตรได้ลงนามในสัญญาเพื่อส่งออกข้าวหอมมะลิอินทรีย์จำนวนห้าพันตันไปยังต่างประเทศ",
      "context": "work"
    },
    {
      "en": "In many Southeast Asian homes, freshly steamed fragrant rice is served alongside every home-cooked meal.",
      "th": "ในหลายครอบครัวแถบเอเชียตะวันออกเฉียงใต้ ข้าวสวยหุงสุกร้อนๆ จะถูกเสิร์ฟคู่กับกับข้าวแทบทุกมื้อที่บ้าน",
      "context": "general"
    }
  ],
  "ox_rich": [
    {
      "en": "Although the founder came from a rich family, she chose to bootstrap her software business without parental funding.",
      "th": "แม้ผู้ก่อตั้งจะมาจากครอบครัวที่ร่ำรวย แต่เธอก็เลือกที่จะสร้างธุรกิจซอฟต์แวร์ด้วยทุนตนเองโดยไม่พึ่งพาเงินจากพ่อแม่",
      "context": "work"
    },
    {
      "en": "Northern Thailand is widely celebrated for its rich cultural heritage and distinctive culinary traditions.",
      "th": "ภาคเหนือของไทยมีชื่อเสียงโด่งดังไปทั่วเรื่องมรดกทางวัฒนธรรมที่รุ่มรวยและประเพณีด้านอาหารการกินอันเป็นเอกลักษณ์",
      "context": "general"
    }
  ],
  "ox_rid": [
    {
      "en": "The newly appointed department head moved quickly to rid the organization of redundant approval processes.",
      "th": "หัวหน้าแผนกที่เพิ่งได้รับการแต่งตั้งคนใหม่รีบลงมือจัดการยกเลิกขั้นตอนการอนุมัติที่ซ้ำซ้อนทิ้งไปอย่างรวดเร็ว",
      "context": "work"
    },
    {
      "en": "We spent all Saturday morning cleaning out the garage to get rid of broken appliances and old cardboard boxes.",
      "th": "พวกเราใช้เวลาตลอดเช้าวันเสาร์เก็บกวาดโรงรถเพื่อกำจัดเครื่องใช้ไฟฟ้าพังๆ และลังกระดาษเก่าๆ ทิ้งไป",
      "context": "general"
    }
  ],
  "ox_ride": [
    {
      "en": "To avoid morning gridlock in the business district, several colleagues prefer to ride the electric train to the office.",
      "th": "เพื่อหลีกเลี่ยงรถติดช่วงเช้าในย่านธุรกิจ เพื่อนร่วมงานหลายคนจึงเลือกนั่งรถไฟฟ้ามาทำงานที่ออฟฟิศแทน",
      "context": "work"
    },
    {
      "en": "On sunny weekend mornings, he loves to ride his bicycle along the riverside trail with his friends.",
      "th": "ในเช้าวันหยุดสุดสัปดาห์ที่แดดดีๆ เขาชอบออกไปปั่นจักรยานไปตามเส้นทางเลียบแม่น้ำกับกลุ่มเพื่อน",
      "context": "general"
    }
  ],
  "ox_rider": [
    {
      "en": "Due to torrential evening rain, the food delivery rider arrived twenty minutes behind schedule.",
      "th": "เนื่องจากฝนตกหนักช่วงค่ำ ไรเดอร์ส่งอาหารเลยมาส่งช้ากว่าเวลาที่กำหนดไปยี่สิบนาที",
      "context": "work"
    },
    {
      "en": "Traffic safety regulations mandate that every motorcycle rider and passenger must wear a certified protective helmet.",
      "th": "กฎความปลอดภัยทางถนนกำหนดให้ผู้ขับขี่และผู้ซ้อนท้ายรถจักรยานยนต์ทุกคนต้องสวมหมวกนิรภัยที่ได้มาตรฐาน",
      "context": "general"
    }
  ],
  "ox_ridiculous": [
    {
      "en": "Expecting a small team of two engineers to redesign the entire banking portal in four days is totally ridiculous.",
      "th": "การคาดหวังให้ทีมวิศวกรแค่สองคนยกเครื่องพอร์ทัลระบบธนาคารใหม่ทั้งหมดในเวลาสี่วันถือเป็นเรื่องที่ไร้สาระสิ้นดี",
      "context": "work"
    },
    {
      "en": "They charged an absolutely ridiculous price for a tiny cup of airport coffee.",
      "th": "พวกเขาตั้งราคากาแฟแก้วเล็กๆ ในสนามบินไว้แพงเกินไปจนน่าเกลียด",
      "context": "general"
    }
  ],
  "ox_riding": [
    {
      "en": "Our field technicians spend most of their shifts riding motorbikes across town to service equipment at customer branches.",
      "th": "ช่างเทคนิคภาคสนามของเราใช้เวลาเกือบทั้งกะขี่มอเตอร์ไซค์ไปทั่วเมืองเพื่อซ่อมบำรุงอุปกรณ์ตามสาขาของลูกค้า",
      "context": "work"
    },
    {
      "en": "She discovered a deep love for horseback riding when she spent her summer break at her grandparents' ranch.",
      "th": "เธอค้นพบว่าตนเองหลงใหลในการขี่ม้าอย่างแท้จริงตอนที่ไปพักผ่อนช่วงปิดเทอมฤดูร้อนที่ฟาร์มของคุณตาคุณยาย",
      "context": "general"
    }
  ],
  "ox_right": [
    {
      "en": "Finding the right candidate for this senior engineering position took our talent acquisition team nearly four months.",
      "th": "การค้นหาผู้สมัครที่เหมาะสมสำหรับตำแหน่งวิศวกรระดับอาวุโสนี้ทำให้ทีมสรรหาบุคลากรของเราต้องใช้เวลานานเกือบสี่เดือน",
      "context": "work"
    },
    {
      "en": "Take a right turn immediately after the gas station, and the entrance to the park will be straight ahead.",
      "th": "เลี้ยวขวาทันทีหลังจากผ่านปั๊มน้ำมัน แล้วทางเข้าสวนสาธารณะจะอยู่ตรงหน้าพอดี",
      "context": "general"
    }
  ],
  "ox_rightly": [
    {
      "en": "The project manager was rightly praised by the executives for delivering the complex client system ahead of schedule.",
      "th": "ผู้จัดการโปรเจกต์ได้รับคำชมเชยอย่างสมเกียรติจากผู้บริหารจากการส่งมอบระบบลูกค้าที่ซับซ้อนได้ก่อนกำหนดเวลา",
      "context": "work"
    },
    {
      "en": "Residents were rightly worried when local authorities issued a flood warning following three days of non-stop rain.",
      "th": "ชาวบ้านต่างรู้สึกกังวลใจอย่างสมเหตุสมผลเมื่อทางการท้องถิ่นประกาศเตือนภัยน้ำท่วมหลังฝนตกกระหน่ำติดต่อกันสามวัน",
      "context": "general"
    }
  ],
  "ox_ring_1": [
    {
      "en": "During the strategy workshop, the facilitator drew a bold red ring around our top customer pain point on the whiteboard.",
      "th": "ในระหว่างเวิร์กช็อปวางแผนกลยุทธ์ วิทยากรได้วาดวงกลมสีแดงเข้มล้อมรอบปัญหาใหญ่ที่สุดของลูกค้าบนไวท์บอร์ด",
      "context": "work"
    },
    {
      "en": "He picked out an elegant platinum wedding ring adorned with a modest round diamond.",
      "th": "เขาเลือกแหวนแต่งงานแพลทินัมดีไซน์เรียบหรูที่ประดับด้วยเพชรทรงกลมขนาดกำลังพอดี",
      "context": "general"
    }
  ],
  "ox_ring_2": [
    {
      "en": "I'll ring the procurement vendor directly this afternoon to clarify the updated shipment dates.",
      "th": "เดี๋ยวบ่ายนี้ฉันจะโทรหาเวนเดอร์ฝ่ายจัดซื้อโดยตรงเพื่อสอบถามวันจัดส่งสินค้าที่อัปเดตใหม่อีกครั้ง",
      "context": "work"
    },
    {
      "en": "Just ring the front door bell when you arrive at the apartment, and I'll come down to buzz you in.",
      "th": "พอมาถึงอพาร์ตเมนต์ก็กดกริ่งหน้าประตูได้เลยนะ เดี๋ยวฉันลงไปเปิดประตูรับข้างล่าง",
      "context": "general"
    }
  ],
  "ox_ring_back": [
    {
      "en": "I'm in a confidential client presentation right now, but I will ring you back the moment it ends.",
      "th": "ตอนนี้ผมติดพรีเซนต์งานที่เป็นความลับกับลูกค้าอยู่ เดี๋ยวเสร็จแล้วผมจะรีบโทรกลับหาคุณทันทีเลยนะครับ",
      "context": "work"
    },
    {
      "en": "She promised to ring back after dinner to share the driving directions to the lake cabin.",
      "th": "เธอรับปากว่าจะโทรกลับมาหลังกินข้าวเย็นเสร็จ เพื่อบอกเส้นทางขับรถไปยังบ้านพักริมทะเลสาบ",
      "context": "general"
    }
  ],
  "ox_rise": [
    {
      "en": "Commercial real estate rental rates in the city center are forecast to rise sharply over the coming year.",
      "th": "มีการคาดการณ์ว่าอัตราค่าเช่าอสังหาริมทรัพย์เพื่อการพาณิชย์ใจกลางเมืองจะปรับตัวสูงขึ้นอย่างมากในปีหน้า",
      "context": "work"
    },
    {
      "en": "He makes it a habit to rise at dawn every morning so he can enjoy a peaceful hour of reading.",
      "th": "เขาติดเป็นนิสัยที่จะตื่นนอนตั้งแต่เช้าตรู่ เพื่อจะได้มีเวลาอ่านหนังสือเงียบๆ คนเดียวสักหนึ่งชั่วโมง",
      "context": "general"
    }
  ],
  "ox_risk": [
    {
      "en": "Entering an unfamiliar overseas market without local partners carries a significant financial risk.",
      "th": "การเข้าไปบุกตลาดต่างประเทศที่ไม่คุ้นเคยโดยไม่มีพาร์ตเนอร์ท้องถิ่นถือว่ามีความเสี่ยงทางการเงินสูงมาก",
      "context": "work"
    },
    {
      "en": "Adopting a balanced diet and exercising regularly can drastically lower your risk of cardiovascular disease.",
      "th": "การรับประทานอาหารที่มีประโยชน์และการออกกำลังกายสม่ำเสมอช่วยลดความเสี่ยงต่อโรคหัวใจและหลอดเลือดได้อย่างมาก",
      "context": "general"
    }
  ],
  "ox_rival": [
    {
      "en": "Our main market rival has just launched an aggressive marketing campaign offering free three-month trials.",
      "th": "คู่แข่งรายสำคัญในตลาดของเราเพิ่งเปิดตัวแคมเปญการตลาดเชิงรุกด้วยการแจกสิทธิ์ทดลองใช้ฟรีสามเดือน",
      "context": "work"
    },
    {
      "en": "The two football clubs have been bitter local rivals for more than a century.",
      "th": "สโมสรฟุตบอลทั้งสองทีมเป็นคู่ปรับร่วมเมืองตัวฉกาจกันมายาวนานกว่าหนึ่งศตวรรษแล้ว",
      "context": "general"
    }
  ],
  "ox_river": [
    {
      "en": "Environmental monitors took water samples from multiple discharge points along the river to trace potential chemical leaks.",
      "th": "เจ้าหน้าที่ตรวจสอบสิ่งแวดล้อมเก็บตัวอย่างน้ำจากจุดปล่อยน้ำหลายแห่งตามแนวแม่น้ำ เพื่อแกะรอยการรั่วไหลของสารเคมี",
      "context": "work"
    },
    {
      "en": "We rented a small wooden cabin by the river where we spent our evenings watching boats drift quietly past.",
      "th": "เราเช่ากระท่อมไม้หลังเล็กริมแม่น้ำ แล้วใช้เวลายามเย็นนั่งมองเรือแล่นผ่านไปอย่างเงียบสงบ",
      "context": "general"
    }
  ],
  "ox_road": [
    {
      "en": "Our logistics supervisor mapped out alternate routes for the delivery fleet because of emergency road repairs downtown.",
      "th": "หัวหน้างานโลจิสติกส์ได้วางแผนเส้นทางสำรองให้กับกองรถขนส่ง เนื่องจากมีการซ่อมแซมถนนฉุกเฉินในย่านใจกลางเมือง",
      "context": "work"
    },
    {
      "en": "Drive carefully on that narrow mountain road, particularly at night when thick fog rolls in.",
      "th": "ขับรถบนถนนเลียบภูเขาที่แคบเส้นนั้นต้องระมัดระวังเป็นพิเศษ โดยเฉพาะตอนกลางคืนที่หมอกหนาจัดลงมาปกคลุม",
      "context": "general"
    }
  ],
  "ox_rob": [
    {
      "en": "Persistent micro-management and toxic workplace politics can rob talented employees of their enthusiasm and drive.",
      "th": "การคอยจู้จี้จุกจิกตลอดเวลาและบรรยากาศการเมืองอันเป็นพิษในที่ทำงาน สามารถพรากความกระตือรือร้นและพลังใจของพนักงานเก่งๆ ไปจนหมด",
      "context": "work"
    },
    {
      "en": "Two armed suspects broke into the jewelry shop late at night and attempted to rob the central display case.",
      "th": "คนร้ายติดอาวุธสองคนบุกเข้าไปในร้านอัญมณีช่วงดึกสงัดและพยายามจะปล้นตู้โชว์กระจกตรงกลางร้าน",
      "context": "general"
    }
  ],
  "ox_rock": [
    {
      "en": "Geotechnical engineers drilled rock core samples across the valley floor to verify bedrock stability before building the bridge.",
      "th": "วิศวกรธรณีเทคนิคได้เจาะเก็บตัวอย่างแท่งหินทั่วบริเวณหุบเขา เพื่อตรวจสอบความมั่นคงของชั้นหินดานก่อนเริ่มสร้างสะพาน",
      "context": "work"
    },
    {
      "en": "We climbed onto a flat rock overlooking the ocean to watch the sunset paint the sky in shades of amber.",
      "th": "เราปีนขึ้นไปนั่งบนโขดหินเรียบที่มองเห็นวิวทะเล เพื่อชมพระอาทิตย์ตกดินที่กำลังย้อมท้องฟ้าให้เป็นสีส้มทอง",
      "context": "general"
    }
  ],
  "ox_role": [
    {
      "en": "She transitioned seamlessly into her new role as head of product and immediately modernized the sprint workflows.",
      "th": "เธอปรับตัวเข้ากับบทบาทใหม่ในตำแหน่งหัวหน้าฝ่ายผลิตภัณฑ์ได้อย่างราบรื่น และได้ลงมือปฏิรูประบบการทำงานแบบสปรินต์ทันที",
      "context": "work"
    },
    {
      "en": "Mentors play a transformative role in helping young professionals build self-confidence and practical career skills.",
      "th": "พี่เลี้ยงมีบทบาทสำคัญอย่างยิ่งในการช่วยให้คนรุ่นใหม่เกิดความมั่นใจในตนเองและพัฒนาทักษะการทำงานจริง",
      "context": "general"
    }
  ],
  "ox_roll": [
    {
      "en": "The operations department intends to roll out the updated customer support platform across regional offices next Monday.",
      "th": "ฝ่ายปฏิบัติการตั้งเป้าที่จะเริ่มเปิดตัวระบบสนับสนุนลูกค้าตัวใหม่ไปยังสำนักงานสาขาในภูมิภาคในวันจันทร์หน้า",
      "context": "work"
    },
    {
      "en": "The toddler laughed with delight as he watched his brightly colored rubber ball roll down the hallway.",
      "th": "เด็กวัยเตาะแตะหัวเราะร่าด้วยความดีใจขณะมองลูกบอลยางสีสดใสกลิ้งไปตามโถงทางเดินในบ้าน",
      "context": "general"
    }
  ],
  "ox_romantic": [
    {
      "en": "Having an undisclosed romantic relationship with a direct subordinate creates obvious conflicts of interest under company policy.",
      "th": "การมีความสัมพันธ์เชิงชู้สาวกับผู้ใต้บังคับบัญชาโดยตรงโดยไม่แจ้งให้ทราบ ถือเป็นความขัดแย้งทางผลประโยชน์ที่ชัดเจนตามนโยบายบริษัท",
      "context": "work"
    },
    {
      "en": "They celebrated their fifth wedding anniversary with a quiet, romantic candlelit dinner at a rooftop bistro.",
      "th": "พวกเขาฉลองครบรอบแต่งงานปีที่ห้าด้วยมื้อค่ำใต้แสงเทียนอันแสนโรแมนติกและเงียบสงบที่ร้านอาหารบนดาดฟ้า",
      "context": "general"
    }
  ],
  "ox_roof": [
    {
      "en": "The building maintenance crew repaired the persistent water leaks on the warehouse roof before the heavy rains arrived.",
      "th": "ทีมช่างบำรุงรักษาอาคารได้เข้าซ่อมแซมรอยน้ำรั่วซึมเรื้อรังบนหลังคาคลังสินค้าเสร็จเรียบร้อยก่อนที่พายุฝนจะมาเยือน",
      "context": "work"
    },
    {
      "en": "We walked up to the apartment roof after dusk to enjoy the cool evening breeze and look at the city skyline.",
      "th": "พวกเราเดินขึ้นไปบนดาดฟ้าอพาร์ตเมนต์หลังพลบค่ำเพื่อรับลมเย็นๆ และชมแสงสีของเส้นขอบฟ้าเมืองหลวง",
      "context": "general"
    }
  ],
  "ox_room": [
    {
      "en": "Although your draft proposal is thoroughly researched, there is still substantial room for improvement in cost efficiency.",
      "th": "แม้ร่างข้อเสนอของคุณจะผ่านการค้นคว้ามาอย่างละเอียดรอบคอบ แต่เรื่องความคุ้มค่าด้านต้นทุนก็ยังมีจุดที่พัฒนาต่อได้อีกมาก",
      "context": "work"
    },
    {
      "en": "I reserved a spacious corner room with large floor-to-ceiling windows overlooking the hotel garden.",
      "th": "ฉันจองห้องพักมุมห้องขนาดกว้างขวางที่มีหน้าต่างบานใหญ่จรดพื้นจรดเพดานซึ่งมองเห็นสวนของโรงแรมเอาไว้",
      "context": "general"
    }
  ],
  "ox_root": [
    {
      "en": "Before implementing quick fixes, the engineering team conducted a detailed investigation to identify the root cause of the server failure.",
      "th": "ก่อนที่จะลงมือแก้ปัญหาเฉพาะหน้า ทีมวิศวกรได้ตรวจสอบอย่างละเอียดถี่ถ้วนเพื่อค้นหาต้นตอที่แท้จริงของเหตุเซิร์ฟเวอร์ล่ม",
      "context": "work"
    },
    {
      "en": "The ancient banyan tree grew massive roots that gradually cracked open sections of the stone courtyard.",
      "th": "ต้นไทรโบราณแผ่รากขนาดมหึมาจนค่อยๆ ดันแผ่นหินบริเวณลานกว้างให้ปริแตกออก",
      "context": "general"
    }
  ],
  "ox_rope": [
    {
      "en": "Site safety protocols require all exterior window washers to inspect their harness ropes before descending the high-rise tower.",
      "th": "ระเบียบความปลอดภัยในสถานที่ทำงานกำหนดให้พนักงานเช็ดกระจกภายนอกอาคารทุกคนต้องตรวจเช็กเชือกนิรภัยก่อนโรยตัวลงมาจากตึกสูง",
      "context": "work"
    },
    {
      "en": "We bought a sturdy twenty-meter nylon rope to anchor our kayak safely to the wooden lakeside dock.",
      "th": "เราซื้อเชือกไนลอนเส้นเหนียวความยาวประมาณยี่สิบเมตรมาผูกยึดเรือคายัคเข้ากับท่าเทียบเรือริมทะเลสาบอย่างแน่นหนา",
      "context": "general"
    }
  ],
  "ox_rough": [
    {
      "en": "Our lead analyst put together a rough cost estimate so senior management could decide whether to pursue the joint venture.",
      "th": "หัวหน้านักวิเคราะห์ของเราได้จัดทำตัวเลขประมาณการต้นทุนคร่าวๆ ขึ้นมา เพื่อให้ผู้บริหารระดับสูงตัดสินใจว่าจะร่วมทุนหรือไม่",
      "context": "work"
    },
    {
      "en": "After spending the entire weekend laying stone pavers in the yard without work gloves, his hands felt rough and bruised.",
      "th": "หลังจากใช้เวลาตลอดสุดสัปดาห์ปูแผ่นหินในสวนโดยไม่ได้ใส่ถุงมือ มือของเขาก็รู้สึกหยาบกร้านและมีรอยฟกช้ำ",
      "context": "general"
    }
  ],
  "ox_roughly": [
    {
      "en": "According to our operational forecast, transitioning to cloud storage will cut server maintenance expenses by roughly thirty percent.",
      "th": "จากการคาดการณ์ด้านการปฏิบัติการของเรา การย้ายระบบไปใช้คลาวด์จะช่วยลดค่าใช้จ่ายในการบำรุงรักษาเซิร์ฟเวอร์ลงได้ราวๆ สามสิบเปอร์เซ็นต์",
      "context": "work"
    },
    {
      "en": "It takes roughly forty minutes by public bus to reach the domestic terminal from our residential neighborhood.",
      "th": "ปกติถ้าเดินทางด้วยรถเมล์จะใช้เวลาประมาณสี่สิบนาทีเพื่อไปยังอาคารผู้โดยสารภายในประเทศจากแถวบ้านเรา",
      "context": "general"
    }
  ],
  "ox_round": [
    {
      "en": "We gathered around a large round table in the conference room to ensure everyone could engage in an open discussion.",
      "th": "พวกเรานั่งล้อมโต๊ะกลมขนาดใหญ่ในห้องประชุม เพื่อให้ทุกคนสามารถมีส่วนร่วมในการพูดคุยแลกเปลี่ยนได้อย่างทั่วถึง",
      "context": "work"
    },
    {
      "en": "She chose a charming antique wooden dining set that featured a round table and four matching curved chairs.",
      "th": "เธอเลือกชุดโต๊ะกินข้าวไม้โบราณดีไซน์น่ารักที่ประกอบด้วยโต๊ะทรงกลมและเก้าอี้พนักพิงโค้งเข้าชุดกันสี่ตัว",
      "context": "general"
    }
  ],
  "ox_rounded": [
    {
      "en": "Our graduate trainee program is designed to develop well-rounded future executives with exposure across finance, marketing, and logistics.",
      "th": "โครงการฝึกอบรมพนักงานจบใหม่ของเราได้รับการออกแบบมาเพื่อสร้างผู้บริหารในอนาคตที่มีทักษะรอบด้าน ผ่านประสบการณ์ทั้งด้านการเงิน การตลาด และโลจิสติกส์",
      "context": "work"
    },
    {
      "en": "Parents of young toddlers often prefer coffee tables with rounded edges to reduce the risk of accidental bumps and scrapes.",
      "th": "พ่อแม่ที่มีลูกเล็กวัยเตาะแตะมักจะชอบโต๊ะกลางที่มีขอบโค้งมน เพื่อลดความเสี่ยงจากการเดินชนหรือโดนเหลี่ยมกระแทก",
      "context": "general"
    }
  ],
  "ox_route": [
    {
      "en": "Our dispatch software automatically calculates the most fuel-efficient delivery route for each driver every morning.",
      "th": "ซอฟต์แวร์จัดตารางรถของเราจะคำนวณเส้นทางจัดส่งพัสดุที่ประหยัดน้ำมันที่สุดให้คนขับแต่ละคนโดยอัตโนมัติในทุกๆ เช้า",
      "context": "work"
    },
    {
      "en": "Instead of speeding along the inland expressway, we took the scenic coastal route to enjoy the breathtaking ocean views.",
      "th": "แทนที่จะขับรถบนทางด่วนสายใน เราเลือกใช้เส้นทางเลียบชายฝั่งเพื่อจะได้ชมทัศนียภาพอันงดงามของท้องทะเลไปตลอดทาง",
      "context": "general"
    }
  ],
  "ox_routine": [
    {
      "en": "Backing up client databases nightly has become an automated routine that prevents costly data loss.",
      "th": "การสำรองข้อมูลฐานข้อมูลของลูกค้าทุกค่ำคืนได้กลายเป็นงานประจำอัตโนมัติที่ช่วยป้องกันการสูญหายของข้อมูลสำคัญ",
      "context": "work"
    },
    {
      "en": "Sticking to a healthy morning routine that combines light exercise and a balanced breakfast keeps my energy steady all day.",
      "th": "การรักษากิจวัตรยามเช้าที่ดีต่อสุขภาพด้วยการออกกำลังกายเบาๆ และรับประทานอาหารเช้าที่มีประโยชน์ ช่วยให้ฉันมีพลังงานคงที่ตลอดทั้งวัน",
      "context": "general"
    }
  ],
  "ox_row_1": [
    {
      "en": "The participants seated in the front row stood up during the town hall meeting to ask the CEO critical questions about company restructuring.",
      "th": "ผู้เข้าร่วมประชุมที่นั่งอยู่แถวหน้าได้ลุกขึ้นยืนในระหว่างการประชุมใหญ่เพื่อถามคำถามสำคัญกับซีอีโอเกี่ยวกับการปรับโครงสร้างองค์กร",
      "context": "work"
    },
    {
      "en": "We bought our concert tickets weeks ahead of time and managed to score center seats in row E.",
      "th": "พวกเราจองตั๋วคอนเสิร์ตล่วงหน้าตั้งหลายสัปดาห์ เลยคว้าที่นั่งตรงกลางแถว E มาได้สมใจ",
      "context": "general"
    }
  ],
  "ox_royal": [
    {
      "en": "The luxury hospitality brand delivered royal service and tailored banquets for the visiting foreign dignitaries.",
      "th": "แบรนด์โรงแรมหรูระดับแถวหน้าได้ให้การบริการอย่างสมเกียรติและจัดเลี้ยงอาหารค่ำสุดประณีตเพื่อต้อนรับคณะบุคคลสำคัญจากต่างประเทศ",
      "context": "work"
    },
    {
      "en": "A sea of local citizens and international tourists gathered in front of the royal palace gates to watch the formal procession.",
      "th": "ประชาชนและนักท่องเที่ยวจากทั่วทุกมุมโลกมารวมตัวกันเนืองแน่นหน้าประตูพระราชวังเพื่อรอชมริ้วขบวนพิธีการอันสง่างาม",
      "context": "general"
    }
  ],
  "ox_rub": [
    {
      "en": "Before searing the steak in the cast-iron skillet, the chef used olive oil and crushed herbs to rub the meat evenly.",
      "th": "ก่อนจะนำเนื้อสเต๊กไปจี่บนกระทะเหล็กหล่อ เชฟใช้น้ำมันมะกอกผสมสมุนไพรบดทาและถูลงบนชิ้นเนื้อจนทั่วอย่างสม่ำเสมอ",
      "context": "work"
    },
    {
      "en": "She stepped away from her computer screen to rub her tired eyes and take a brief five-minute breather.",
      "th": "เธอผละออกจากหน้าจอคอมพิวเตอร์เพื่อเอามือขยี้ตาอันอ่อนล้าเบาๆ และพักสายตาสักห้านาที",
      "context": "general"
    }
  ],
  "ox_rubber": [
    {
      "en": "Our manufacturing unit recently switched to a higher-grade synthetic rubber to produce industrial conveyor belts with longer lifespans.",
      "th": "โรงงานผลิตของเราเพิ่งเปลี่ยนมาใช้ยางสังเคราะห์เกรดพรีเมียม เพื่อผลิตสายพานลำเลียงในโรงงานที่มีอายุการใช้งานยาวนานขึ้น",
      "context": "work"
    },
    {
      "en": "Wearing waterproof boots fitted with sturdy rubber outsoles prevented us from slipping on the icy sidewalks.",
      "th": "การสวมรองเท้าบูตกันน้ำที่มีพื้นยางแข็งแรงช่วยป้องกันไม่ให้พวกเราลื่นล้มบนทางเท้าที่ปกคลุมด้วยน้ำแข็ง",
      "context": "general"
    }
  ],
  "ox_rubbish": [
    {
      "en": "The company spokesperson dismissed claims of an impending mass layoff as baseless gossip and total rubbish.",
      "th": "โฆษกของบริษัทออกมาปฏิเสธข่าวลือเรื่องการปลดพนักงานครั้งใหญ่ว่าไม่มีมูลความจริงและเป็นเรื่องไร้สาระทั้งสิ้น",
      "context": "work"
    },
    {
      "en": "Please tie the garbage bag securely and carry the kitchen rubbish out to the curb before collection day.",
      "th": "ช่วยมัดปากถุงขยะให้แน่นหนาแล้วนำขยะจากในครัวออกไปวางไว้ริมทางเท้าก่อนวันรถเก็บขยะมาด้วยนะ",
      "context": "general"
    }
  ],
  "ox_rude": [
    {
      "en": "Interrupting a coworker mid-sentence during an executive client briefing is considered unprofessional and inexcusably rude.",
      "th": "การพูดแทรกเพื่อนร่วมงานขณะที่เขากำลังสรุปงานให้ลูกค้าระดับผู้บริหารฟัง ถือว่าขาดความเป็นมืออาชีพและเสียมารยาทอย่างยิ่ง",
      "context": "work"
    },
    {
      "en": "The diner was so rude to the waitstaff that other patrons in the restaurant began looking around in visible discomfort.",
      "th": "ลูกค้าคนนั้นพูดจาหยาบคายกับพนักงานเสิร์ฟจนคนอื่นๆ ในร้านเริ่มหันมามองด้วยความรู้สึกอึดอัดใจอย่างเห็นได้ชัด",
      "context": "general"
    }
  ],
  "ox_rudely": [
    {
      "en": "The dissatisfied client spoke rudely to our support representative instead of calmly stating what went wrong with the shipment.",
      "th": "ลูกค้าที่ไม่พอใจพูดจาใส่อารมณ์อย่างหยาบคายกับเจ้าหน้าที่บริการลูกค้า แทนที่จะใจเย็นๆ และบอกเล่าว่าเกิดปัญหาอะไรขึ้นกับการจัดส่ง",
      "context": "work"
    },
    {
      "en": "A commuter shoved past commuters rudely on the crowded platform without offering so much as a brief apology.",
      "th": "ผู้โดยสารคนหนึ่งเบียดแทรกผู้คนบนชานชาลาที่แน่นขนัดไปอย่างเสียมารยาทโดยไม่มีแม้แต่คำขอโทษสักคำ",
      "context": "general"
    }
  ],
  "ox_ruin": [
    {
      "en": "Failing to safeguard proprietary source code can ruin our market advantage and destroy investor confidence.",
      "th": "การล้มเหลวในการปกป้องซอร์สโค้ดที่เป็นความลับทางการค้าอาจทำลายความได้เปรียบในตลาดและบั่นทอนความเชื่อมั่นของนักลงทุนจนหมดสิ้น",
      "context": "work"
    },
    {
      "en": "An unexpected torrential downpour completely ruined our plans for an outdoor birthday barbecue in the garden.",
      "th": "ฝนที่ตกลงมาห่าใหญ่อย่างไม่คาดคิดได้ทำลายแผนจัดปาร์ตี้บาร์บีคิววันเกิดกลางสวนของเราจนพังไม่เป็นท่า",
      "context": "general"
    }
  ],
  "ox_ruined": [
    {
      "en": "The agency's reputation was nearly ruined after an unverified press release triggered severe backlash across social media.",
      "th": "ชื่อเสียงของเอเจนซี่เกือบจะพังทลายลงหลังจากแถลงข่าวที่ยังไม่ได้รับการตรวจสอบความถูกต้องก่อให้เกิดกระแสตีกลับอย่างรุนแรงบนโซเชียลมีเดีย",
      "context": "work"
    },
    {
      "en": "Her vintage silk blouse was completely ruined when someone spilled a glass of red wine across the table.",
      "th": "เสื้อเบลาส์ผ้าไหมวินเทจตัวโปรดของเธอเสียหายยับเยินจนใส่ไม่ได้ เมื่อมีคนทำไวน์แดงหกรดข้ามโต๊ะมาโดน",
      "context": "general"
    }
  ],
  "ox_rule": [
    {
      "en": "The compliance officer held an all-hands session to explain the new workplace privacy rules under national data regulations.",
      "th": "เจ้าหน้าที่ฝ่ายกำกับดูแลการปฏิบัติงานได้จัดประชุมพนักงานทุกคนเพื่อชี้แจงกฎความเป็นส่วนตัวในที่ทำงานฉบับใหม่ตามกฎหมายคุ้มครองข้อมูลของประเทศ",
      "context": "work"
    },
    {
      "en": "As an essential rule of internet safety, never share one-time security passwords or sensitive credentials with anyone.",
      "th": "กฎเหล็กข้อสำคัญของความปลอดภัยทางไซเบอร์คือ อย่าแชร์รหัสผ่านความปลอดภัยแบบใช้ครั้งเดียวหรือข้อมูลลับส่วนบุคคลให้แก่ผู้ใดเป็นอันขาด",
      "context": "general"
    }
  ],
  "ox_rule_out": [
    {
      "en": "After evaluating the vendor proposals, the procurement committee decided to rule out bids that exceeded our spending ceiling.",
      "th": "หลังจากประเมินข้อเสนอของเวนเดอร์แต่ละรายแล้ว คณะกรรมการจัดซื้อได้ตัดสินใจตัดข้อเสนอที่มีราคาสูงเกินเพดานงบประมาณของเราออกไป",
      "context": "work"
    },
    {
      "en": "The physician ordered a series of blood tests and chest scans to rule out any underlying respiratory infections.",
      "th": "แพทย์ได้สั่งตรวจเลือดและเอกซเรย์ปอดหลายรายการ เพื่อคัดกรองและตัดประเด็นเรื่องการติดเชื้อในระบบทางเดินหายใจออกไป",
      "context": "general"
    }
  ],
  "ox_ruler": [
    {
      "en": "The guest lecturer explained how the visionary ruler stabilized the economy and established transparent trading codes across the realm.",
      "th": "วิทยากรรับเชิญได้บรรยายถึงวิธีที่ผู้ปกครองผู้มีวิสัยทัศน์กว้างไกลสามารถฟื้นฟูเสถียรภาพทางเศรษฐกิจและวางรากฐานระเบียบการค้าที่โปร่งใสทั่วทั้งดินแดน",
      "context": "work"
    },
    {
      "en": "Please pass me that metal ruler from your pencil case so I can draw clean, straight margins on my sketch.",
      "th": "ช่วยส่งไม้บรรทัดเหล็กในกล่องดินสอของเธอมาให้หน่อยสิ จะเอามาใช้ขีดเส้นขอบภาพสเก็ตช์ให้ตรงและเรียบร้อย",
      "context": "general"
    }
  ]
}

# Verify against batch_49.json
batch_path = r"C:\Users\nipon\.gemini\antigravity-cli\brain\f19bc2c1-ebfd-4330-9cf2-4800f6aa6f93\scratch\ox_batches\batch_49.json"
output_path = r"C:\Users\nipon\.gemini\antigravity-cli\brain\f19bc2c1-ebfd-4330-9cf2-4800f6aa6f93\scratch\ox_batches\batch_49_done.json"

with open(batch_path, encoding="utf-8") as f:
    batch = json.load(f)

batch_ids = [item["id"] for item in batch]

print(f"Batch has {len(batch_ids)} items.")
print(f"Data has {len(data)} items.")

missing = [bid for bid in batch_ids if bid not in data]
extra = [k for k in data if k not in batch_ids]

if missing:
    print(f"MISSING IDs: {missing}")
if extra:
    print(f"EXTRA IDs: {extra}")

assert len(missing) == 0, f"Missing IDs: {missing}"
assert len(extra) == 0, f"Extra IDs: {extra}"
assert len(data) == 60, f"Expected 60, got {len(data)}"

# Check each item
for bid, examples in data.items():
    assert len(examples) == 2, f"{bid} does not have 2 examples"
    for ex in examples:
        assert "en" in ex and len(ex["en"].strip()) > 10, f"{bid} invalid en"
        assert "th" in ex and len(ex["th"].strip()) > 10, f"{bid} invalid th"
        assert "context" in ex and ex["context"] in ["work", "general"], f"{bid} invalid context"

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Successfully wrote {len(data)} items to {output_path}")
