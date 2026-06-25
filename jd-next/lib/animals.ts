export type AnimalCategory = "cattle" | "buffalo" | "poultry" | "sheep" | "fish";

export interface Animal {
  id: string;
  category: AnimalCategory;
  name: string;
  nameHi: string;
  emoji: string;
  breed: string;
  origin: string;
  highlights: string[];
  price: number;
  unit: string;
  gradient: string;
}

export const ANIMALS: Animal[] = [
  // Cattle
  { id:"gir", category:"cattle", name:"Gir Cow", nameHi:"गिर गाय", emoji:"🐄", breed:"Gir", origin:"Gujarat", highlights:["10–12L/day milk","A2 milk","Disease resistant","15–18 yr lifespan"], price:65000, unit:"head", gradient:"from-amber-100 to-amber-200" },
  { id:"sahiwal", category:"cattle", name:"Sahiwal Cow", nameHi:"साहिवाल गाय", emoji:"🐄", breed:"Sahiwal", origin:"Punjab", highlights:["8–10L/day","Heat tolerant","Low feed cost","Good for semi-arid zones"], price:55000, unit:"head", gradient:"from-orange-100 to-orange-200" },
  { id:"ongole", category:"cattle", name:"Ongole Bull", nameHi:"ఒంగోలు ఎద్దు", emoji:"🐂", breed:"Ongole", origin:"Andhra Pradesh", highlights:["Draft + meat breed","1000kg body weight","Strong & hardy","Telangana native"], price:80000, unit:"head", gradient:"from-stone-100 to-stone-200" },
  { id:"jersey-cross", category:"cattle", name:"Jersey Cross", nameHi:"जर्सी क्रॉस", emoji:"🐄", breed:"Jersey × Sahiwal", origin:"Crossbred", highlights:["15–20L/day","High fat content","Good for small farms","Easy calving"], price:45000, unit:"head", gradient:"from-yellow-100 to-yellow-200" },
  { id:"hf-cross", category:"cattle", name:"HF Cross Cow", nameHi:"एचएफ क्रॉस", emoji:"🐄", breed:"Holstein × Zebu", origin:"Crossbred", highlights:["20–25L/day","Best commercial yield","Needs good feed","Popular in Telangana"], price:70000, unit:"head", gradient:"from-sky-100 to-sky-200" },
  { id:"red-sindhi", category:"cattle", name:"Red Sindhi", nameHi:"रेड सिंधी", emoji:"🐄", breed:"Red Sindhi", origin:"Sindh/Pakistan", highlights:["6–8L/day","Extreme heat tolerance","Tick resistant","Ideal for dry regions"], price:40000, unit:"head", gradient:"from-red-100 to-red-200" },
  // Buffalo
  { id:"murrah", category:"buffalo", name:"Murrah Buffalo", nameHi:"मुर्रा भैंस", emoji:"🐃", breed:"Murrah", origin:"Haryana", highlights:["10–14L/day","6–8% fat milk","Top breed India","Large body frame"], price:90000, unit:"head", gradient:"from-slate-100 to-slate-200" },
  { id:"surti", category:"buffalo", name:"Surti Buffalo", nameHi:"सुरती भैंस", emoji:"🐃", breed:"Surti", origin:"Gujarat", highlights:["8–10L/day","6–7% fat","Medium size","Good for AP/Telangana"], price:60000, unit:"head", gradient:"from-zinc-100 to-zinc-200" },
  { id:"nili-ravi", category:"buffalo", name:"Nili-Ravi Buffalo", nameHi:"नीली-रावी भैंस", emoji:"🐃", breed:"Nili-Ravi", origin:"Punjab", highlights:["12–16L/day","High yield","Heavy body 600kg","Long lactation"], price:110000, unit:"head", gradient:"from-neutral-100 to-neutral-200" },
  { id:"jaffrabadi", category:"buffalo", name:"Jaffrabadi Buffalo", nameHi:"जाफराबादी भैंस", emoji:"🐃", breed:"Jaffrabadi", origin:"Gujarat", highlights:["Heaviest breed","Good for meat","10–12L/day","Strong draft animal"], price:85000, unit:"head", gradient:"from-gray-100 to-gray-200" },
  // Poultry
  { id:"kadaknath", category:"poultry", name:"Kadaknath Chicken", nameHi:"कड़कनाथ मुर्गा", emoji:"🐓", breed:"Kadaknath", origin:"Madhya Pradesh", highlights:["Black meat (medicinal)","High protein 25%","Premium price ₹600–800/kg","Disease resistant"], price:800, unit:"bird", gradient:"from-purple-100 to-purple-200" },
  { id:"asil", category:"poultry", name:"Asil Rooster", nameHi:"असील मुर्गा", emoji:"🐓", breed:"Asil", origin:"Andhra Pradesh", highlights:["Telangana native breed","High meat quality","Heritage breed","Strong immune system"], price:1200, unit:"bird", gradient:"from-rose-100 to-rose-200" },
  { id:"rir", category:"poultry", name:"Rhode Island Red", nameHi:"रोड आइलैंड रेड", emoji:"🥚", breed:"RIR", origin:"USA crossbred", highlights:["200–250 eggs/year","Dual purpose","Hardy bird","Good for backyard"], price:350, unit:"bird", gradient:"from-red-100 to-orange-100" },
  { id:"giriraja", category:"poultry", name:"Giriraja Chicken", nameHi:"गिरिराज मुर्गी", emoji:"🐔", breed:"Giriraja", origin:"Karnataka", highlights:["160–180 eggs/year","Low feed conversion","Free-range suitable","Fast growth"], price:250, unit:"bird", gradient:"from-lime-100 to-green-100" },
  // Sheep
  { id:"deccani", category:"sheep", name:"Deccani Sheep", nameHi:"దెక్కని గొర్రె", emoji:"🐑", breed:"Deccani", origin:"Telangana/AP", highlights:["Native Telangana breed","Drought tolerant","Good wool + meat","Hardy in dry climate"], price:8000, unit:"head", gradient:"from-emerald-100 to-teal-100" },
  { id:"nellore", category:"sheep", name:"Nellore Sheep", nameHi:"నెల్లూరు గొర్రె", emoji:"🐑", breed:"Nellore", origin:"Andhra Pradesh", highlights:["Excellent mutton quality","Fast growth","Heat tolerant","High demand"], price:12000, unit:"head", gradient:"from-teal-100 to-cyan-100" },
  { id:"mandya", category:"sheep", name:"Mandya Sheep", nameHi:"मांड्या भेड़", emoji:"🐑", breed:"Mandya", origin:"Karnataka", highlights:["Fine wool","Tropical adaptation","Medium size","Smooth coat"], price:9000, unit:"head", gradient:"from-cyan-100 to-sky-100" },
  { id:"marwari", category:"sheep", name:"Marwari Sheep", nameHi:"मारवाड़ी भेड़", emoji:"🐑", breed:"Marwari", origin:"Rajasthan", highlights:["Carpet wool","Desert breed","Hardy constitution","Curved horns"], price:7000, unit:"head", gradient:"from-amber-100 to-yellow-100" },
  // Fish
  { id:"rohu", category:"fish", name:"Rohu", nameHi:"రోహు చేప", emoji:"🐟", breed:"Rohu (Labeo rohita)", origin:"Inland waters", highlights:["Most farmed in India","Fast growth 1kg in 6 months","High market demand","Pond + tank farming"], price:180, unit:"kg (live)", gradient:"from-blue-100 to-indigo-100" },
  { id:"catla", category:"fish", name:"Catla", nameHi:"కట్ల చేప", emoji:"🐠", breed:"Catla (Gibelion catla)", origin:"Inland waters", highlights:["Surface feeder","Quick growth","2kg in 12 months","Premium price"], price:220, unit:"kg (live)", gradient:"from-indigo-100 to-violet-100" },
  { id:"tilapia", category:"fish", name:"Tilapia", nameHi:"తిలాపియా", emoji:"🐟", breed:"Nile Tilapia", origin:"Introduced", highlights:["Fastest growing fish","Tolerates low oxygen","Year-round farming","Export demand"], price:150, unit:"kg (live)", gradient:"from-cyan-100 to-teal-100" },
  { id:"vannamei", category:"fish", name:"Vannamei Shrimp", nameHi:"వన్నామేయ్ రొయ్య", emoji:"🦐", breed:"Litopenaeus vannamei", origin:"AP/Telangana coastal", highlights:["₹400–600/kg farmgate","Export quality","90-day crop cycle","High ROI"], price:500, unit:"kg (live)", gradient:"from-pink-100 to-rose-100" },
];
