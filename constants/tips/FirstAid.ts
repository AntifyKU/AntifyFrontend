import { AntTopic } from "../AntTopics";

export const FIRST_AID_TOPIC: AntTopic = {
  id: "first_aid",
  accentColor: "#dc2626",
  title: "Ant Stings & Bites — First Aid Guide",
  subtitle:
    "What to do immediately after an ant sting or bite, how to recognize dangerous reactions, and when to seek medical help.",
  heroImage:
    "https://res.cloudinary.com/denlxho1c/image/upload/v1774103644/tips/obkd_bmyf_220912_sxksvr.jpg",
  images: {
    bite_vs_sting:
      "https://res.cloudinary.com/denlxho1c/image/upload/v1774110231/tips/unnamed_6_ka7l6o.jpg",
    anaphylaxis_signs:
      "https://res.cloudinary.com/denlxho1c/image/upload/v1774110508/tips/Gemini_Generated_Image_96rx2096rx2096rx_grnxgn.png",
    treatment_steps:
      "https://res.cloudinary.com/denlxho1c/image/upload/v1774110634/tips/unnamed_8_n6g7p7.jpg",
    dangerous_species:
      "https://res.cloudinary.com/denlxho1c/image/upload/v1774110976/tips/unnamed_9_fmqpwh.jpg",
  },
  tabs: [
    {
      label: "Basics",
      sections: [
        {
          heading: null,
          body: "Most ant encounters are harmless — a brief pinch, a moment of irritation, and it's over. But some species deliver genuinely dangerous venom, and **allergic reactions can occur even from species considered medically minor**. Knowing the difference between a normal reaction and a dangerous one could save a life.",
          imageKey: null,
          imageCaption: null,
        },
        {
          heading: "Bites vs. Stings — They're Different",
          body: "**Bites** use the ant's mandibles (jaws). Most ants bite. The wound is typically a small pinch or scratch, sometimes with formic acid sprayed into it. Pain is mild to moderate and fades within minutes.\n\n**Stings** use a modified ovipositor located at the tip of the abdomen. Only certain species sting — notably fire ants (Solenopsis), jack jumper ants (Myrmecia), bulldog ants, and bullet ants (Paraponera). Stings inject venom directly into tissue and cause significantly more pain and longer-lasting reactions.\n\n**A critical point:** many species do both simultaneously — they bite to anchor themselves, then sting repeatedly. Fire ants are notorious for this behavior. A single fire ant can sting 7–8 times in one attack.",
          imageKey: "bite_vs_sting",
          imageCaption:
            "Left: mandible bite wound (surface scratch). Right: sting wound (central puncture with surrounding wheal)",
        },
        {
          heading: "Normal Reaction — What to Expect",
          body: "A **normal local reaction** to an ant sting or bite includes:\n- Immediate sharp pain or burning at the site\n- Redness and swelling within the first few minutes\n- Itching developing over the next 1–2 hours\n- A small raised weal (hive-like bump) at the sting site\n\nFor **fire ant stings specifically**, a characteristic white pustule forms within **8–24 hours**. This is caused by the unique alkaloid venom (solenopsin) — not infection. The pustule can persist for **3–7 days** before resolving on its own.\n\nAll of the above is expected and requires only basic home care.",
        },
        {
          heading: "Basic Home Treatment",
          body: "For **mild stings and bites** with a normal local reaction:\n\n**Step 1 — Move away:** Leave the area immediately. Fire ants will continue stinging as long as they remain on skin. Brush them off with a dry sweep — water can agitate them and trigger more stings.\n\n**Step 2 — Wash the area:** Clean thoroughly with soap and water to remove surface venom and reduce infection risk.\n\n**Step 3 — Cold compress:** Apply ice wrapped in cloth (never directly on skin) for 10–15 minutes to reduce swelling and numb pain. Repeat as needed.\n\n**Step 4 — Antihistamine:** An oral antihistamine (cetirizine, loratadine, or diphenhydramine) reduces itching and local swelling. Take as directed on the label.\n\n**Step 5 — Topical relief:** Hydrocortisone 1% cream applied to the sting site reduces inflammation and itch. Calamine lotion also helps.\n\n**Step 6 — Leave pustules intact:** If fire ant pustules form, **do not pop them**. Breaking the pustule significantly increases risk of bacterial infection (secondary impetigo) and delays healing.",
          imageKey: "treatment_steps",
          imageCaption:
            "Basic first aid sequence: brush off ants, wash with soap, cold compress, oral antihistamine",
        },
      ],
    },
    {
      label: "Allergic Reactions",
      sections: [
        {
          heading: "Three Levels of Allergic Response",
          body: "Allergic reactions to ant venom range from mildly uncomfortable to life-threatening. Understanding the three levels helps determine the right response:\n\n**Large Local Reaction (LLR):** Swelling and redness that extends significantly beyond the sting site — often covering an entire limb within hours. This is uncomfortable but **not dangerous** in itself. It peaks at 24–48 hours and resolves over 5–10 days. Treat with oral antihistamines and a short course of oral corticosteroids if severe. LLR does not reliably predict risk of anaphylaxis on future stings.\n\n**Systemic (Generalized) Allergic Reaction:** Symptoms appear in a different body part from where the sting occurred. May include hives spreading across the body, facial swelling, nausea, vomiting, or abdominal cramps — without breathing difficulty. Requires **immediate medical attention**.\n\n**Anaphylaxis:** A severe, potentially fatal systemic reaction involving the cardiovascular or respiratory system. Requires **emergency treatment within minutes**.",
          imageKey: null,
          imageCaption: null,
        },
        {
          heading: "Recognizing Anaphylaxis — Act Immediately",
          body: "Anaphylaxis typically develops within **5–30 minutes** of a sting, though it can be delayed up to 2 hours. The hallmark is **rapid progression** affecting multiple body systems at once.\n\n**Warning signs — any of these warrant emergency action:**\n- Hives, flushing, or itching spreading rapidly across the body\n- Swelling of the face, lips, tongue, or throat\n- Difficulty breathing, wheezing, or tightness in the chest\n- Hoarse voice or difficulty swallowing\n- Dizziness, lightheadedness, or sudden drop in blood pressure\n- Rapid or weak pulse\n- Pale, grey, or bluish skin\n- Nausea, vomiting, or sudden diarrhea alongside any respiratory or cardiovascular symptom\n- Sudden intense anxiety or sense of impending doom\n- Loss of consciousness\n\n**A person does not need all of these symptoms.** Two or more body systems being affected after a known sting is sufficient to treat as anaphylaxis.",
          imageKey: "anaphylaxis_signs",
          imageCaption:
            "Anaphylaxis recognition: multiple body systems affected within minutes of a sting",
        },
        {
          heading: "Emergency Response for Anaphylaxis",
          body: "**If anaphylaxis is suspected, every second counts.**\n\n**1. Administer epinephrine (EpiPen) immediately** if available. Epinephrine is the only effective first-line treatment for anaphylaxis — antihistamines and steroids act too slowly. Inject into the outer mid-thigh. Can be administered through clothing.\n\n**2. Call emergency services immediately** — 1669 in Thailand — even if epinephrine has been given. The patient needs hospital monitoring for at least 4–6 hours due to the risk of a biphasic (recurrent) reaction.\n\n**3. Position correctly:**\n- Breathing difficulty: sit upright or semi-reclined\n- Dizzy or faint: lay flat with legs elevated\n- Unconscious and breathing: recovery position\n- Never leave an anaphylactic patient standing — collapse can be sudden and without warning\n\n**4. Second epinephrine dose:** Give after 5–15 minutes if symptoms persist and a second auto-injector is available.\n\n**5. Do not substitute antihistamines or steroids for epinephrine.** They may be given as adjuncts but cannot reverse anaphylaxis on their own.",
        },
        {
          heading: "Who Is at Higher Risk",
          body: "Not everyone reacts the same way to ant venom. These factors increase the risk of a severe reaction:\n\n**Previous systemic reaction:** The strongest predictor of future anaphylaxis. Anyone who has had a generalized allergic reaction to an ant sting should carry an EpiPen at all times and see an allergist.\n\n**Asthma:** Increases the risk of a severe respiratory component during anaphylaxis.\n\n**Mast cell disorders:** Conditions such as mastocytosis dramatically increase anaphylaxis risk from any insect venom.\n\n**Multiple simultaneous stings (50+):** Can cause a toxic — not allergic — systemic reaction from sheer venom volume, even in people with no allergy history. Symptoms mimic anaphylaxis and require the same emergency response.\n\n**Beta-blocker medications:** Can worsen anaphylaxis severity and significantly reduce the effectiveness of epinephrine. People on beta-blockers who are venom-allergic require specialist review.\n\n**Very young children and elderly individuals** may experience more severe reactions and have more difficulty communicating symptoms.",
          imageKey: null,
          imageCaption: null,
        },
      ],
    },
    {
      label: "Species & Prevention",
      sections: [
        {
          heading: "Most Medically Important Species",
          body: "The vast majority of ant species are medically insignificant. These are the ones that warrant genuine caution:\n\n**Fire ants (Solenopsis invicta / S. geminata)** — the most medically important ants in Thailand and globally. Responsible for the majority of serious ant sting reactions. They attack in groups, sting repeatedly, and their alkaloid venom (solenopsin) causes the characteristic pustule reaction. Extremely aggressive when their mound is disturbed.\n\n**Weaver ant (Oecophylla smaragdina)** — extremely common in Thailand. Bites powerfully and sprays formic acid into the wound. Painful and potentially concerning for sensitive individuals, but generally not dangerous without true allergy.\n\n**Jack jumper ant (Myrmecia pilosula)** — primarily Australia. Responsible for more anaphylaxis deaths than any other ant species. Extremely aggressive, powerful venom, and a high rate of sensitization in exposed populations.\n\n**Bullet ant (Paraponera clavata)** — Central and South America. Delivers the most painful insect sting known to science — rated 4+ on the Schmidt Sting Pain Index, described as 'pure, intense, brilliant pain like walking over flaming charcoal' lasting up to 24 hours.\n\n**Bulldog ants (Myrmecia spp.)** — Australia. Large, aggressive, powerful venom. Significant anaphylaxis potential.",
          imageKey: "dangerous_species",
          imageCaption: "Dangerous ant species",
        },
        {
          heading: "Prevention",
          body: "**Everyday precautions:**\n- Wear closed-toe shoes and socks in gardens, grass, and natural areas\n- Shake out shoes, clothing, and gardening gloves that have been left outdoors\n- Never disturb ant mounds — give fire ant mounds especially a wide berth\n- Keep food sealed and clean up spills promptly to avoid attracting foraging ants\n- Seal cracks in walls, floors, and foundations to reduce indoor ant access\n\n**For high-risk individuals (known venom allergy):**\n- Always carry a prescribed epinephrine auto-injector (EpiPen) — carry two\n- Wear a medical alert bracelet identifying venom allergy\n- Inform companions where your EpiPen is kept and how to use it\n- Consider **venom immunotherapy (allergy shots)** — highly effective for fire ant allergy, offering up to 98% protection against future anaphylaxis after a full course\n\n**When working outdoors:**\n- Tuck trousers into socks in areas with known ant activity\n- Check before sitting or kneeling on ground in grass or disturbed soil\n- Be especially cautious after rain — ants surface in large numbers after soil flooding",
          imageKey: null,
          imageCaption: null,
        },
        {
          heading: "Long-Term Management",
          body: "If you or someone you know has experienced a systemic or anaphylactic reaction to an ant sting, these steps are important:\n\n**See an allergist.** Skin prick tests and specific IgE blood tests can confirm ant venom allergy and guide treatment decisions. This is especially important before starting immunotherapy.\n\n**Carry epinephrine auto-injectors.** Get a prescription for two — one may not be enough. Check expiry dates every 6 months and replace before expiry.\n\n**Consider venom immunotherapy (VIT).** Regular subcutaneous injections of increasing venom doses over 3–5 years progressively desensitize the immune system. Fire ant VIT success rates are among the highest of any allergen immunotherapy.\n\n**Create a written emergency action plan.** Specify: when to administer epinephrine, when to call emergency services, and instructions for bystanders. Share it with family members, coworkers, and school staff.",
          imageKey: null,
          imageCaption: null,
        },
        {
          heading: "Special Situations",
          body: "**Children:** Young children cannot always communicate symptoms. Watch for sudden crying, skin rubbing, facial swelling, labored breathing, or sudden limpness after a known sting. Administer weight-appropriate antihistamine for mild reactions; use the EpiPen and call emergency services for any systemic signs.\n\n**Sting inside the mouth or throat:** If an ant stings inside the mouth, local swelling can obstruct the airway even without a true systemic allergy. Seek emergency care immediately regardless of allergy history.\n\n**Mass stings (50+ stings):** Toxic — not allergic — systemic reactions can occur from venom overload, including headache, fever, vomiting, and in severe cases, rhabdomyolysis (muscle breakdown). Requires hospital evaluation even in people with no known allergy.\n\n**Stings near the eye:** Rinse gently with clean water. Seek ophthalmology review if pain, persistent redness, or visual changes remain after 30 minutes.",
          imageKey: null,
          imageCaption: null,
        },
      ],
    },
  ],
  references: [
    {
      title:
        "Hymenoptera Venom Allergy — European Academy of Allergy and Clinical Immunology Guidelines",
      url: "https://www.eaaci.org",
      author: "Bilo, B.M. et al.",
      year: "2020",
    },
    {
      title: "Fire Ant Venom Allergy",
      author: "deShazo, R.D. & Butcher, B.T.",
      year: "2009",
    },
    {
      title: "Anaphylaxis — World Allergy Organization Guidelines",
      url: "https://www.worldallergy.org",
      author: "Simons, F.E.R. et al.",
      year: "2015",
    },
    {
      title: "The Schmidt Sting Pain Index",
      author: "Schmidt, J.O.",
      year: "1990",
    },
    {
      title: "Ant Venom Immunotherapy — Clinical Review",
      author: "Brown, S.G.A. et al.",
      year: "2011",
    },
    {
      title: "Medical Importance of Ants — AntWiki",
      url: "https://www.antwiki.org/wiki/Medical_Importance",
      author: "AntWiki Contributors",
      year: "2023",
    },
  ],
};
