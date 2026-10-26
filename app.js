'use strict';
const products = [
 {id:'living-1',category:'living',name:'Луна',kind:'Диван и интерьерная группа',price:189000,description:'Мягкий силуэт, светлая фактурная обивка и выразительные округлые формы. Коллекция для неспешных вечеров дома.'},
 {id:'living-2',category:'living',name:'Милан',kind:'Модульная гостиная',price:224000,description:'Объёмный диван в карамельных оттенках. Свободная композиция, которую легко представить в просторной гостиной.'},
 {id:'living-3',category:'living',name:'Бруно',kind:'Современная гостиная',price:176000,description:'Лаконичная мягкая мебель и глубокая фактура дерева. Спокойная композиция с продуманными акцентами.'},
 {id:'living-4',category:'living',name:'Версаль',kind:'Гостиная в современной классике',price:258000,description:'Мягкие светлые тона и деликатные классические детали. Тёплая атмосфера для встреч с близкими.'},
 {id:'bedroom-1',category:'bedroom',name:'Тишина',kind:'Спальный гарнитур',price:238000,description:'Мягкое изголовье, тёплый орех и спокойные оттенки. Личное пространство, в котором хочется задержаться.'},
 {id:'bedroom-2',category:'bedroom',name:'Свет',kind:'Спальный гарнитур',price:264000,description:'Светлые рельефные фасады и мягкие фактуры. Воздушная композиция для светлой спальни.'},
 {id:'bedroom-3',category:'bedroom',name:'Контур',kind:'Спальня с мягкой подсветкой',price:219000,description:'Графитовое округлое изголовье и тёплая контурная подсветка. Выразительная мебель с ощущением камерного уюта.'},
 {id:'bedroom-4',category:'bedroom',name:'Тепло',kind:'Спальня в натуральных оттенках',price:196000,description:'Натуральная палитра, текстура дуба и мягкая геометрия. Спальня, наполненная теплом.'},
 {id:'kitchen-1',category:'kitchen',name:'Орех',kind:'Угловая кухня',price:348000,description:'Светлые рельефные фасады, ореховая столешница и деликатные латунные детали. Кухня как центр повседневной жизни.'},
 {id:'kitchen-2',category:'kitchen',name:'Графит',kind:'Современная кухня',price:386000,description:'Глубокий графит, каменные фактуры и лаконичные фасады. Строгая композиция с выразительными материалами.'},
 {id:'kitchen-3',category:'kitchen',name:'Классика',kind:'Кухня с рамочными фасадами',price:312000,description:'Светлые рамочные фасады и аккуратные классические детали. Атмосфера дома, в который хочется возвращаться.'},
 {id:'kitchen-4',category:'kitchen',name:'Ритм',kind:'Кухня в натуральной палитре',price:294000,description:'Дуб и матовые серые поверхности. Сдержанное сочетание для удобного пространства на каждый день.'}
];
const categoryNames={living:'Гостиные',bedroom:'Спальни',kitchen:'Кухни'};
const currency=new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:0});
const number=new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0});
const $=s=>document.querySelector(s);
const panel=$('#products');
let activeProduct=products[0];
function renderCategory(category){
 panel.setAttribute('aria-labelledby','tab-'+category);
 panel.innerHTML=products.filter(p=>p.category===category).map(p=>`<article class="product"><button class="product-image" data-detail="${p.id}" aria-label="Подробнее: ${p.name}"><img src="assets/${p.id}.webp" alt="${p.kind} ${p.name}" width="1200" height="900" loading="lazy"></button><div class="product-info"><p class="product-kind">${p.kind}</p><button class="product-title" data-detail="${p.id}">${p.name}</button><p class="product-price">${currency.format(p.price)}</p><p class="product-payment">от ${currency.format(Math.ceil(p.price*.7/12))} / мес.</p><button class="product-calc" data-calculate="${p.id}">Рассчитать рассрочку</button></div></article>`).join('');
 document.querySelectorAll('[role=tab]').forEach(t=>{const chosen=t.dataset.category===category;t.setAttribute('aria-selected',String(chosen));t.tabIndex=chosen?0:-1});
}
document.querySelectorAll('[role=tab]').forEach((tab,index,tabs)=>{
 tab.addEventListener('click',()=>renderCategory(tab.dataset.category));
 tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();tabs[next].focus();renderCategory(tabs[next].dataset.category)});
});
$('#calc-product').innerHTML=Object.entries(categoryNames).map(([key,label])=>`<optgroup label="${label}">${products.filter(p=>p.category===key).map(p=>`<option value="${p.id}">${p.name} · ${currency.format(p.price)}</option>`).join('')}</optgroup>`).join('')+'<option value="custom">Индивидуальная стоимость</option>';
function updateCalculation(){
 const input=$('#price');const raw=Number(input.value);const valid=Number.isFinite(raw)&&raw>=1000&&raw<=10000000;
 input.setCustomValidity(valid?'':'Введите сумму от 1 000 до 10 000 000 ₽');
 const price=valid?raw:0;const percent=Number($('#deposit').value);const months=Number($('input[name=months]:checked').value);const first=Math.round(price*percent/100);const balance=price-first;
 $('#deposit-value').textContent=percent+'%';$('#deposit-rubles').textContent=valid?currency.format(first):'Введите стоимость';$('#monthly').textContent=valid?number.format(Math.ceil(balance/months)):'…';$('#balance').textContent=valid?currency.format(balance):'…';
}
function selectForCalculation(id){const product=products.find(p=>p.id===id);if(!product)return;$('#calc-product').value=id;$('#price').value=product.price;updateCalculation();$('#installment').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
$('#calc-product').addEventListener('change',event=>{const p=products.find(p=>p.id===event.target.value);if(p)$('#price').value=p.price;updateCalculation()});
$('#price').addEventListener('input',()=>{$('#calc-product').value='custom';updateCalculation()});$('#deposit').addEventListener('input',updateCalculation);document.querySelectorAll('input[name=months]').forEach(r=>r.addEventListener('change',updateCalculation));
const dialog=$('#product-dialog');
function openProduct(id){const p=products.find(p=>p.id===id);if(!p)return;activeProduct=p;$('#dialog-image').src=`assets/${p.id}.webp`;$('#dialog-image').alt=p.kind+' '+p.name;$('#dialog-category').textContent=categoryNames[p.category];$('#dialog-title').textContent=p.name;$('#dialog-description').textContent=p.description;$('#dialog-price').textContent=currency.format(p.price);dialog.showModal();}
panel.addEventListener('click',event=>{const detail=event.target.closest('[data-detail]');const calc=event.target.closest('[data-calculate]');if(detail)openProduct(detail.dataset.detail);if(calc)selectForCalculation(calc.dataset.calculate)});
$('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});$('#dialog-calculate').addEventListener('click',()=>{dialog.close();selectForCalculation(activeProduct.id)});
$('.menu-toggle').addEventListener('click',()=>{const open=$('.header nav').classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',String(open));$('.menu-toggle').textContent=open?'Закрыть':'Меню'});
$('.header nav').addEventListener('click',()=>{$('.header nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').textContent='Меню'});
renderCategory('living');updateCalculation();
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.08});document.querySelectorAll('.section').forEach(el=>{el.classList.add('reveal');observer.observe(el)});}
