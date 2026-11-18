/* ---------------- CONTENT ---------------- */
const WORD_CATS = [
 ["x","Самые нужные слова"],["q","Вопросы"],["p","Люди и семья"],["n","Числа"],["d","Время и дни"],["k","Цвета"],
 ["f","Еда и напитки"],["h","Дом и вещи"],["c","Город и дорога"],["s","Покупки и деньги"],["b","Тело и здоровье"],
 ["w","Погода и природа"],["v","Главные глаголы"],["a","Описания"]
];
const WORDS_RAW = `
x|yes|jes|да|Yes, please.|Да, пожалуйста.
x|no|nəʊ|нет|No, thank you.|Нет, спасибо.
x|please|pliːz|пожалуйста (в просьбе)|Water, please.|Воды, пожалуйста.
x|thank you|ˈθæŋk juː|спасибо|Thank you very much!|Большое спасибо!
x|sorry|ˈsɒri|извините, простите|Sorry, I don't understand.|Извините, я не понимаю.
x|excuse me|ɪkˈskjuːz miː|извините (чтобы обратиться)|Excuse me, where is the toilet?|Извините, где туалет?
x|okay|əʊˈkeɪ|хорошо, ладно|Okay, let's go.|Хорошо, пошли.
x|and|ænd|и|Tea and coffee.|Чай и кофе.
x|but|bʌt|но|It's cheap but good.|Дёшево, но хорошо.
x|or|ɔː|или|Tea or coffee?|Чай или кофе?
x|because|bɪˈkɒz|потому что|I'm tired because I worked a lot.|Я устала, потому что много работала.
x|very|ˈveri|очень|It's very hot.|Очень жарко.
x|too|tuː|тоже; слишком|Me too!|Я тоже!
x|also|ˈɔːlsəʊ|также|I also speak Russian.|Я также говорю по-русски.
x|only|ˈəʊnli|только|Only one, please.|Только один, пожалуйста.
x|again|əˈɡen|снова, ещё раз|Say it again, please.|Повторите, пожалуйста.
x|maybe|ˈmeɪbi|может быть|Maybe later.|Может, позже.
x|always|ˈɔːlweɪz|всегда|I always drink coffee in the morning.|Я всегда пью кофе утром.
x|usually|ˈjuːʒuəli|обычно|I usually get up at eight.|Обычно я встаю в восемь.
x|sometimes|ˈsʌmtaɪmz|иногда|Sometimes I cook at home.|Иногда я готовлю дома.
x|never|ˈnevə|никогда|I never eat meat.|Я никогда не ем мясо.
x|already|ɔːlˈredi|уже|I've already eaten.|Я уже поела.
x|still|stɪl|всё ещё|I'm still here.|Я всё ещё здесь.
x|a lot|ə lɒt|много|Thanks a lot!|Большое спасибо!
x|a little|ə ˈlɪtl|немного|I speak a little English.|Я немного говорю по-английски.
x|with|wɪð|с|Coffee with milk, please.|Кофе с молоком, пожалуйста.
x|without|wɪˈðaʊt|без|Without ice, please.|Без льда, пожалуйста.
q|what|wɒt|что, какой|What is this?|Что это?
q|where|weə|где, куда|Where are you from?|Откуда ты?
q|when|wen|когда|When does it open?|Когда открывается?
q|who|huː|кто|Who is that?|Кто это?
q|why|waɪ|почему|Why not?|Почему бы и нет?
q|how|haʊ|как|How are you?|Как дела?
q|which|wɪtʃ|который, какой (из)|Which one?|Который?
q|how much|haʊ mʌtʃ|сколько (стоит)|How much is it?|Сколько это стоит?
q|how many|haʊ ˈmeni|сколько (штук)|How many people?|Сколько человек?
q|how long|haʊ lɒŋ|как долго|How long does it take?|Сколько времени это занимает?
p|man|mæn|мужчина (мн. men)|That man is my neighbour.|Тот мужчина — мой сосед.
p|woman|ˈwʊmən|женщина (мн. women)|The woman is very kind.|Эта женщина очень добрая.
p|child|tʃaɪld|ребёнок (мн. children)|They have one child.|У них один ребёнок.
p|boy|bɔɪ|мальчик|The boy is five.|Мальчику пять лет.
p|girl|ɡɜːl|девочка, девушка|She is a nice girl.|Она милая девушка.
p|friend|frend|друг, подруга|This is my friend Kate.|Это моя подруга Кейт.
p|family|ˈfæməli|семья|My family lives in Russia.|Моя семья живёт в России.
p|mother|ˈmʌðə|мама, мать|My mother is a teacher.|Моя мама — учитель.
p|father|ˈfɑːðə|папа, отец|My father likes fishing.|Мой папа любит рыбалку.
p|parents|ˈpeərənts|родители|My parents are at home.|Мои родители дома.
p|sister|ˈsɪstə|сестра|I have a sister.|У меня есть сестра.
p|brother|ˈbrʌðə|брат|My brother is older than me.|Мой брат старше меня.
p|son|sʌn|сын|Their son is a student.|Их сын — студент.
p|daughter|ˈdɔːtə|дочь|She has a daughter.|У неё есть дочь.
p|husband|ˈhʌzbənd|муж|Her husband is from Italy.|Её муж из Италии.
p|wife|waɪf|жена|His wife is a doctor.|Его жена — врач.
p|baby|ˈbeɪbi|малыш, младенец|The baby is sleeping.|Малыш спит.
p|people|ˈpiːpl|люди|There are many people here.|Здесь много людей.
p|name|neɪm|имя|What's your name?|Как тебя зовут?
p|neighbour|ˈneɪbə|сосед|My neighbour has a dog.|У моего соседа есть собака.
p|student|ˈstjuːdnt|студент|I'm a student.|Я студентка.
p|job|dʒɒb|работа, должность|I like my job.|Мне нравится моя работа.
n|one|wʌn|один|I have one brother.|У меня один брат.
n|two|tuː|два|Two coffees, please.|Два кофе, пожалуйста.
n|three|θriː|три|It's three o'clock.|Сейчас три часа.
n|four|fɔː|четыре|A table for four, please.|Столик на четверых, пожалуйста.
n|five|faɪv|пять|Five minutes, please.|Пять минут, пожалуйста.
n|six|sɪks|шесть|Let's meet at six.|Давай встретимся в шесть.
n|seven|ˈsevn|семь|The shop opens at seven.|Магазин открывается в семь.
n|eight|eɪt|восемь|I sleep eight hours.|Я сплю восемь часов.
n|nine|naɪn|девять|My flat is number nine.|Моя квартира — номер девять.
n|ten|ten|десять|It's ten dollars.|Это стоит десять долларов.
n|eleven|ɪˈlevn|одиннадцать|The film starts at eleven.|Фильм начинается в одиннадцать.
n|twelve|twelv|двенадцать|Twelve eggs, please.|Двенадцать яиц, пожалуйста.
n|fifteen|ˌfɪfˈtiːn|пятнадцать|Wait fifteen minutes.|Подожди пятнадцать минут.
n|twenty|ˈtwenti|двадцать|It costs twenty dollars.|Это стоит двадцать долларов.
n|thirty|ˈθɜːti|тридцать|I'm thirty years old.|Мне тридцать лет.
n|hundred|ˈhʌndrəd|сто|One hundred baht, please.|Сто бат, пожалуйста.
n|thousand|ˈθaʊznd|тысяча|It's two thousand baht.|Это две тысячи бат.
n|first|fɜːst|первый|It's my first day here.|Это мой первый день здесь.
n|second|ˈsekənd|второй; секунда|Wait a second!|Секунду!
n|half|hɑːf|половина|Half past six.|Половина седьмого.
n|number|ˈnʌmbə|номер, число|What's your phone number?|Какой у тебя номер телефона?
d|time|taɪm|время; раз|What time is it?|Который час?
d|day|deɪ|день|Have a nice day!|Хорошего дня!
d|week|wiːk|неделя|See you next week.|Увидимся на следующей неделе.
d|month|mʌnθ|месяц|I'm here for a month.|Я здесь на месяц.
d|year|jɪə|год|Happy New Year!|С Новым годом!
d|today|təˈdeɪ|сегодня|I'm free today.|Сегодня я свободна.
d|tomorrow|təˈmɒrəʊ|завтра|See you tomorrow!|До завтра!
d|yesterday|ˈjestədeɪ|вчера|I was tired yesterday.|Вчера я устала.
d|morning|ˈmɔːnɪŋ|утро|Good morning!|Доброе утро!
d|afternoon|ˌɑːftəˈnuːn|день (после полудня)|Good afternoon!|Добрый день!
d|evening|ˈiːvnɪŋ|вечер|Good evening!|Добрый вечер!
d|night|naɪt|ночь|Good night!|Спокойной ночи!
d|hour|ˈaʊə|час|One hour, please.|Один час, пожалуйста.
d|minute|ˈmɪnɪt|минута|Just a minute.|Минутку.
d|now|naʊ|сейчас|I'm busy now.|Я сейчас занята.
d|later|ˈleɪtə|позже|Call me later.|Позвони мне позже.
d|early|ˈɜːli|рано|I get up early.|Я встаю рано.
d|late|leɪt|поздно; опоздавший|Sorry, I'm late.|Извините, я опоздала.
d|weekend|ˌwiːkˈend|выходные|What are you doing at the weekend?|Что делаешь на выходных?
d|Monday|ˈmʌndeɪ|понедельник|See you on Monday.|Увидимся в понедельник.
d|Tuesday|ˈtjuːzdeɪ|вторник|The shop is closed on Tuesday.|Во вторник магазин закрыт.
d|Wednesday|ˈwenzdeɪ|среда|I have English on Wednesday.|В среду у меня английский.
d|Thursday|ˈθɜːzdeɪ|четверг|My flight is on Thursday.|Мой рейс в четверг.
d|Friday|ˈfraɪdeɪ|пятница|Friday is my favourite day.|Пятница — мой любимый день.
d|Saturday|ˈsætədeɪ|суббота|Let's go to the beach on Saturday.|Пойдём на пляж в субботу.
d|Sunday|ˈsʌndeɪ|воскресенье|I rest on Sunday.|В воскресенье я отдыхаю.
k|colour|ˈkʌlə|цвет|What colour is it?|Какого это цвета?
k|black|blæk|чёрный|I want a black T-shirt.|Хочу чёрную футболку.
k|white|waɪt|белый|The room is white.|Комната белая.
k|red|red|красный|I like red cars.|Мне нравятся красные машины.
k|blue|bluː|синий, голубой|The sea is blue.|Море голубое.
k|green|ɡriːn|зелёный|Green tea, please.|Зелёный чай, пожалуйста.
k|yellow|ˈjeləʊ|жёлтый|The taxi is yellow.|Такси жёлтое.
k|grey|ɡreɪ|серый|The sky is grey today.|Небо сегодня серое.
k|brown|braʊn|коричневый|She has brown eyes.|У неё карие глаза.
k|pink|pɪŋk|розовый|Pink is my favourite colour.|Розовый — мой любимый цвет.
f|food|fuːd|еда|Thai food is delicious.|Тайская еда очень вкусная.
f|water|ˈwɔːtə|вода|A bottle of water, please.|Бутылку воды, пожалуйста.
f|coffee|ˈkɒfi|кофе|I drink coffee every morning.|Я пью кофе каждое утро.
f|tea|tiː|чай|Tea with milk, please.|Чай с молоком, пожалуйста.
f|milk|mɪlk|молоко|No milk, thanks.|Без молока, спасибо.
f|juice|dʒuːs|сок|Orange juice, please.|Апельсиновый сок, пожалуйста.
f|beer|bɪə|пиво|One cold beer, please.|Одно холодное пиво, пожалуйста.
f|bread|bred|хлеб|I need bread.|Мне нужен хлеб.
f|rice|raɪs|рис|Chicken with rice, please.|Курицу с рисом, пожалуйста.
f|egg|eɡ|яйцо|Two eggs, please.|Два яйца, пожалуйста.
f|chicken|ˈtʃɪkɪn|курица|I'll have the chicken.|Я возьму курицу.
f|meat|miːt|мясо|I don't eat meat.|Я не ем мясо.
f|fish|fɪʃ|рыба|The fish is very fresh.|Рыба очень свежая.
f|vegetables|ˈvedʒtəblz|овощи|I eat a lot of vegetables.|Я ем много овощей.
f|fruit|fruːt|фрукты|I buy fruit at the market.|Я покупаю фрукты на рынке.
f|apple|ˈæpl|яблоко|I want an apple.|Я хочу яблоко.
f|banana|bəˈnɑːnə|банан|Bananas are cheap here.|Бананы здесь дешёвые.
f|sugar|ˈʃʊɡə|сахар|No sugar, please.|Без сахара, пожалуйста.
f|salt|sɔːlt|соль|Can I have some salt?|Можно немного соли?
f|ice|aɪs|лёд|No ice, please.|Без льда, пожалуйста.
f|breakfast|ˈbrekfəst|завтрак|Breakfast is at eight.|Завтрак в восемь.
f|lunch|lʌntʃ|обед|Let's have lunch together.|Давай пообедаем вместе.
f|dinner|ˈdɪnə|ужин|What's for dinner?|Что на ужин?
f|menu|ˈmenjuː|меню|Can I see the menu?|Можно меню?
f|bill|bɪl|счёт (в кафе)|The bill, please.|Счёт, пожалуйста.
f|delicious|dɪˈlɪʃəs|очень вкусный|This soup is delicious!|Этот суп очень вкусный!
f|spicy|ˈspaɪsi|острый|Not spicy, please.|Не остро, пожалуйста.
f|hungry|ˈhʌŋɡri|голодный|I'm hungry.|Я голодна.
f|thirsty|ˈθɜːsti|хочется пить|I'm thirsty.|Я хочу пить.
h|house|haʊs|дом (здание)|They live in a big house.|Они живут в большом доме.
h|home|həʊm|дом (родной); домой|I'm going home.|Я иду домой.
h|flat|flæt|квартира (в США — apartment)|My flat is small.|Моя квартира маленькая.
h|room|ruːm|комната; номер|My room is on the second floor.|Моя комната на втором этаже.
h|kitchen|ˈkɪtʃɪn|кухня|The kitchen is small.|Кухня маленькая.
h|bathroom|ˈbɑːθruːm|ванная; туалет|Where is the bathroom?|Где туалет?
h|bed|bed|кровать|The bed is very comfortable.|Кровать очень удобная.
h|door|dɔː|дверь|Close the door, please.|Закрой дверь, пожалуйста.
h|window|ˈwɪndəʊ|окно|Can I open the window?|Можно открыть окно?
h|table|ˈteɪbl|стол|The keys are on the table.|Ключи на столе.
h|chair|tʃeə|стул|This chair is free.|Этот стул свободен.
h|key|kiː|ключ|I lost my key.|Я потеряла ключ.
h|phone|fəʊn|телефон|My phone is dead.|У меня сел телефон.
h|bag|bæɡ|сумка; пакет|Do you need a bag?|Вам нужен пакет?
h|clothes|kləʊðz|одежда|I need to wash my clothes.|Мне нужно постирать одежду.
h|shoes|ʃuːz|обувь|Take off your shoes, please.|Снимите обувь, пожалуйста.
h|towel|ˈtaʊəl|полотенце|Can I have a clean towel?|Можно чистое полотенце?
h|light|laɪt|свет|Turn off the light, please.|Выключи свет, пожалуйста.
h|air conditioner|ˈeə kənˌdɪʃənə|кондиционер|The air conditioner doesn't work.|Кондиционер не работает.
h|floor|flɔː|пол; этаж|I live on the third floor.|Я живу на третьем этаже.
h|book|bʊk|книга|I'm reading a good book.|Я читаю хорошую книгу.
h|cup|kʌp|чашка|A cup of tea, please.|Чашку чая, пожалуйста.
c|city|ˈsɪti|город|Bangkok is a big city.|Бангкок — большой город.
c|street|striːt|улица|What street is it?|Какая это улица?
c|road|rəʊd|дорога|The road is very busy.|На дороге много машин.
c|shop|ʃɒp|магазин|The shop is closed.|Магазин закрыт.
c|market|ˈmɑːkɪt|рынок|Let's go to the market.|Пойдём на рынок.
c|restaurant|ˈrestrɒnt|ресторан|Is there a good restaurant near here?|Здесь рядом есть хороший ресторан?
c|cafe|ˈkæfeɪ|кафе|Let's meet at the cafe.|Давай встретимся в кафе.
c|hotel|həʊˈtel|отель|My hotel is near the beach.|Мой отель рядом с пляжем.
c|hospital|ˈhɒspɪtl|больница|Where is the hospital?|Где больница?
c|pharmacy|ˈfɑːməsi|аптека|Is there a pharmacy near here?|Здесь рядом есть аптека?
c|bank|bæŋk|банк|The bank opens at nine.|Банк открывается в девять.
c|beach|biːtʃ|пляж|Let's go to the beach!|Пошли на пляж!
c|airport|ˈeəpɔːt|аэропорт|Take me to the airport, please.|Отвезите меня в аэропорт.
c|car|kɑː|машина|I don't have a car.|У меня нет машины.
c|bus|bʌs|автобус|Where is the bus stop?|Где автобусная остановка?
c|taxi|ˈtæksi|такси|Let's take a taxi.|Давай возьмём такси.
c|bike|baɪk|велосипед; байк|I go everywhere by bike.|Я везде езжу на байке.
c|ticket|ˈtɪkɪt|билет|One ticket, please.|Один билет, пожалуйста.
c|left|left|налево; левый|Turn left.|Поверните налево.
c|right|raɪt|направо; правый; правильный|Turn right at the corner.|На углу поверните направо.
c|straight|streɪt|прямо|Go straight.|Идите прямо.
c|near|nɪə|рядом, близко|Is it near?|Это близко?
c|far|fɑː|далеко|Is it far from here?|Это далеко отсюда?
c|here|hɪə|здесь, сюда|Stop here, please.|Остановитесь здесь, пожалуйста.
c|there|ðeə|там, туда|I live there.|Я живу там.
s|money|ˈmʌni|деньги|I don't have money.|У меня нет денег.
s|price|praɪs|цена|What's the price?|Какая цена?
s|cash|kæʃ|наличные|Cash or card?|Наличные или карта?
s|card|kɑːd|карта|Can I pay by card?|Можно оплатить картой?
s|change|tʃeɪndʒ|сдача; менять|Keep the change.|Сдачи не надо.
s|size|saɪz|размер|Do you have a bigger size?|Есть размер побольше?
s|discount|ˈdɪskaʊnt|скидка|Can you give me a discount?|Можете сделать скидку?
s|cheap|tʃiːp|дешёвый|It's very cheap.|Это очень дёшево.
s|expensive|ɪkˈspensɪv|дорогой|It's too expensive.|Это слишком дорого.
s|free|friː|бесплатный; свободный|Is it free?|Это бесплатно?
s|open|ˈəʊpən|открытый; открывать|Is the shop open?|Магазин открыт?
s|closed|kləʊzd|закрытый|The bank is closed.|Банк закрыт.
s|receipt|rɪˈsiːt|чек|Can I have a receipt?|Можно чек?
b|head|hed|голова|My head hurts.|У меня болит голова.
b|eye|aɪ|глаз|She has blue eyes.|У неё голубые глаза.
b|ear|ɪə|ухо|My ear hurts.|У меня болит ухо.
b|mouth|maʊθ|рот|Open your mouth, please.|Откройте рот, пожалуйста.
b|tooth|tuːθ|зуб (мн. teeth)|My tooth hurts.|У меня болит зуб.
b|hand|hænd|рука (кисть)|Wash your hands.|Помой руки.
b|arm|ɑːm|рука (вся)|My arm hurts.|У меня болит рука.
b|leg|leɡ|нога|I hurt my leg.|Я повредила ногу.
b|foot|fʊt|стопа (мн. feet)|My feet are tired.|У меня устали ноги.
b|back|bæk|спина; назад|My back hurts.|У меня болит спина.
b|stomach|ˈstʌmək|живот, желудок|I have a stomach ache.|У меня болит живот.
b|doctor|ˈdɒktə|врач|I need a doctor.|Мне нужен врач.
b|medicine|ˈmedsn|лекарство|Take this medicine twice a day.|Принимайте это лекарство два раза в день.
b|sick|sɪk|больной|I feel sick.|Мне плохо.
b|pain|peɪn|боль|I have a pain here.|У меня болит здесь.
b|hurt|hɜːt|болеть, ранить|It hurts!|Больно!
b|tired|ˈtaɪəd|уставший|I'm very tired.|Я очень устала.
b|fine|faɪn|хорошо, нормально|I'm fine, thanks.|У меня всё хорошо, спасибо.
w|weather|ˈweðə|погода|The weather is nice today.|Сегодня хорошая погода.
w|sun|sʌn|солнце|The sun is very strong here.|Здесь очень сильное солнце.
w|rain|reɪn|дождь|I love the sound of rain.|Я люблю звук дождя.
w|wind|wɪnd|ветер|The wind is strong today.|Сегодня сильный ветер.
w|hot|hɒt|жаркий, горячий|It's so hot today!|Сегодня так жарко!
w|cold|kəʊld|холодный|The water is cold.|Вода холодная.
w|warm|wɔːm|тёплый|The sea is warm.|Море тёплое.
w|sea|siː|море|I swim in the sea every day.|Я плаваю в море каждый день.
w|sky|skaɪ|небо|Look at the sky!|Посмотри на небо!
w|tree|triː|дерево|There is a big tree near my house.|У моего дома большое дерево.
w|flower|ˈflaʊə|цветок|These flowers are beautiful.|Эти цветы красивые.
w|mountain|ˈmaʊntɪn|гора|We climbed the mountain.|Мы поднялись на гору.
w|island|ˈaɪlənd|остров|Phuket is an island.|Пхукет — это остров.
w|dog|dɒɡ|собака|The dog is friendly.|Собака дружелюбная.
w|cat|kæt|кошка, кот|My cat sleeps all day.|Мой кот спит весь день.
w|bird|bɜːd|птица|I can hear birds.|Я слышу птиц.
w|summer|ˈsʌmə|лето|It's summer all year here.|Здесь лето круглый год.
w|winter|ˈwɪntə|зима|Winter in Russia is cold.|Зима в России холодная.
v|be|biː|быть · was / were|I want to be happy.|Я хочу быть счастливой.
v|have|hæv|иметь · had|I have a question.|У меня есть вопрос.
v|do|duː|делать · did|What do you do?|Чем ты занимаешься?
v|go|ɡəʊ|идти, ехать · went|I go to the gym every day.|Я хожу в спортзал каждый день.
v|come|kʌm|приходить · came|Come here, please.|Подойди сюда, пожалуйста.
v|want|wɒnt|хотеть|I want a coffee.|Я хочу кофе.
v|like|laɪk|нравиться, любить|I like this place.|Мне нравится это место.
v|love|lʌv|любить, обожать|I love the sea.|Я обожаю море.
v|know|nəʊ|знать · knew|I don't know.|Я не знаю.
v|think|θɪŋk|думать · thought|I think so.|Думаю, да.
v|see|siː|видеть · saw|I can see the sea.|Я вижу море.
v|look|lʊk|смотреть; выглядеть|Look at this!|Посмотри на это!
v|watch|wɒtʃ|смотреть (фильм)|Let's watch a film.|Давай посмотрим фильм.
v|hear|hɪə|слышать · heard|I can't hear you.|Я тебя не слышу.
v|listen|ˈlɪsn|слушать|Listen to me.|Послушай меня.
v|say|seɪ|сказать · said|What did you say?|Что ты сказала?
v|speak|spiːk|говорить (на языке) · spoke|Do you speak English?|Ты говоришь по-английски?
v|tell|tel|рассказывать · told|Tell me about your day.|Расскажи мне о своём дне.
v|ask|ɑːsk|спрашивать, просить|Can I ask a question?|Можно задать вопрос?
v|answer|ˈɑːnsə|отвечать; ответ|Please answer the phone.|Пожалуйста, ответь на звонок.
v|eat|iːt|есть (кушать) · ate|Let's eat something.|Давай что-нибудь съедим.
v|drink|drɪŋk|пить · drank|I drink a lot of water.|Я пью много воды.
v|sleep|sliːp|спать · slept|I can't sleep.|Я не могу уснуть.
v|work|wɜːk|работать; работа|I work from home.|Я работаю из дома.
v|live|lɪv|жить|Where do you live?|Где ты живёшь?
v|buy|baɪ|покупать · bought|I want to buy a new phone.|Хочу купить новый телефон.
v|pay|peɪ|платить · paid|I'll pay.|Я заплачу.
v|make|meɪk|делать, создавать · made|I make websites.|Я делаю сайты.
v|take|teɪk|брать · took|I'll take it.|Я это возьму.
v|give|ɡɪv|давать · gave|Give me a minute.|Дай мне минутку.
v|get|ɡet|получать; добираться · got|How do I get to the beach?|Как добраться до пляжа?
v|need|niːd|нуждаться, нужно|I need help.|Мне нужна помощь.
v|help|help|помогать; помощь|Can you help me?|Можете мне помочь?
v|understand|ˌʌndəˈstænd|понимать · understood|I don't understand.|Я не понимаю.
v|learn|lɜːn|учить, изучать|I'm learning English.|Я учу английский.
v|read|riːd|читать · read [red]|I read every evening.|Я читаю каждый вечер.
v|write|raɪt|писать · wrote|Can you write it down?|Можете записать?
v|wait|weɪt|ждать|Wait for me!|Подожди меня!
v|call|kɔːl|звонить; звать|I'll call you tomorrow.|Я позвоню тебе завтра.
v|find|faɪnd|находить · found|I can't find my phone.|Не могу найти телефон.
v|lose|luːz|терять · lost|Don't lose the key.|Не потеряй ключ.
v|start|stɑːt|начинать|The film starts at eight.|Фильм начинается в восемь.
v|finish|ˈfɪnɪʃ|заканчивать|I finish work at six.|Я заканчиваю работу в шесть.
v|meet|miːt|встречать(ся) · met|Nice to meet you.|Приятно познакомиться.
v|walk|wɔːk|гулять, идти пешком|Let's walk.|Давай пройдёмся.
v|swim|swɪm|плавать · swam|I swim every morning.|Я плаваю каждое утро.
v|cook|kʊk|готовить (еду)|I like to cook.|Я люблю готовить.
v|wash|wɒʃ|мыть, стирать|I need to wash my hair.|Мне нужно помыть голову.
v|use|juːz|использовать|Can I use your phone?|Можно воспользоваться твоим телефоном?
v|try|traɪ|пробовать|Try this!|Попробуй это!
v|remember|rɪˈmembə|помнить|I remember you!|Я тебя помню!
v|forget|fəˈɡet|забывать · forgot|I forgot my bag.|Я забыла сумку.
a|good|ɡʊd|хороший · better · the best|It's a good idea.|Хорошая идея.
a|bad|bæd|плохой · worse · the worst|The weather is bad today.|Сегодня плохая погода.
a|big|bɪɡ|большой|It's a big house.|Это большой дом.
a|small|smɔːl|маленький|I have a small room.|У меня маленькая комната.
a|new|njuː|новый|I have a new phone.|У меня новый телефон.
a|old|əʊld|старый|This building is very old.|Это здание очень старое.
a|young|jʌŋ|молодой|She is very young.|Она очень молодая.
a|beautiful|ˈbjuːtɪfl|красивый|What a beautiful view!|Какой красивый вид!
a|happy|ˈhæpi|счастливый, довольный|I'm happy to see you.|Я рада тебя видеть.
a|sad|sæd|грустный|Why are you sad?|Почему ты грустишь?
a|easy|ˈiːzi|лёгкий (простой)|It's easy!|Это легко!
a|difficult|ˈdɪfɪkəlt|трудный|English isn't difficult.|Английский не трудный.
a|fast|fɑːst|быстрый; быстро|The Wi-Fi is fast.|Wi‑Fi быстрый.
a|slow|sləʊ|медленный|The bus is very slow.|Автобус очень медленный.
a|long|lɒŋ|длинный, долгий|It was a long day.|Это был долгий день.
a|short|ʃɔːt|короткий; невысокий|My hair is short.|У меня короткие волосы.
a|clean|kliːn|чистый|The room is clean.|Комната чистая.
a|dirty|ˈdɜːti|грязный|My shoes are dirty.|Моя обувь грязная.
a|busy|ˈbɪzi|занятой; оживлённый|I'm busy today.|Сегодня я занята.
a|quiet|ˈkwaɪət|тихий|It's a quiet street.|Это тихая улица.
a|noisy|ˈnɔɪzi|шумный|The bar is too noisy.|В баре слишком шумно.
a|nice|naɪs|приятный, милый|He is very nice.|Он очень милый.
a|wrong|rɒŋ|неправильный|Sorry, wrong number.|Извините, вы ошиблись номером.
a|same|seɪm|тот же самый|The same for me, please.|Мне то же самое, пожалуйста.
a|different|ˈdɪfrənt|другой, разный|We are very different.|Мы очень разные.
a|ready|ˈredi|готовый|Are you ready?|Ты готова?
a|sure|ʃɔː|уверенный; конечно|Sure, no problem!|Конечно, без проблем!
a|favourite|ˈfeɪvərɪt|любимый|What's your favourite film?|Какой твой любимый фильм?
a|important|ɪmˈpɔːtnt|важный|It's important.|Это важно.
a|full|fʊl|полный; сытый|I'm full, thank you.|Я наелась, спасибо.
a|empty|ˈempti|пустой|The bottle is empty.|Бутылка пустая.
`;

const PHRASES = [
 {cat:"Самое нужное", items:[
  "Hello! / Hi!|Здравствуйте! / Привет!",
  "Good morning!|Доброе утро!",
  "How are you? — I'm fine, thanks.|Как дела? — Хорошо, спасибо.",
  "Thank you! — You're welcome.|Спасибо! — Пожалуйста.",
  "Sorry!|Извините!",
  "Excuse me…|Простите… (чтобы обратиться)",
  "No problem.|Без проблем.",
  "See you later!|Увидимся!",
  "Goodbye!|До свидания!"]},
 {cat:"Если не понимаешь", items:[
  "Sorry, I don't understand.|Извините, я не понимаю.",
  "Could you speak more slowly, please?|Можете говорить помедленнее?",
  "Can you say it again, please?|Можете повторить?",
  "What does it mean?|Что это значит?",
  "How do you say it in English?|Как это сказать по-английски?",
  "Can you write it down, please?|Можете это записать?",
  "I speak a little English.|Я немного говорю по-английски."]},
 {cat:"Знакомство", items:[
  "Nice to meet you.|Приятно познакомиться.",
  "What's your name?|Как тебя зовут?",
  "My name is Anna.|Меня зовут Анна.",
  "Where are you from? — I'm from Russia.|Откуда вы? — Я из России.",
  "What do you do?|Чем вы занимаетесь?",
  "I live here.|Я здесь живу.",
  "I'm here on holiday.|Я здесь в отпуске.",
  "How long have you been here?|Как давно вы здесь?"]},
 {cat:"Кафе и еда", items:[
  "Can I see the menu, please?|Можно меню?",
  "What do you recommend?|Что посоветуете?",
  "I'd like the chicken, please.|Мне курицу, пожалуйста.",
  "Not spicy, please.|Не остро, пожалуйста.",
  "No sugar, no ice.|Без сахара и без льда.",
  "To take away, please.|С собой, пожалуйста.",
  "Can I have the bill, please?|Можно счёт?",
  "Can I pay by card?|Можно картой?"]},
 {cat:"Магазин и рынок", items:[
  "How much is this?|Сколько это стоит?",
  "Can you give me a discount?|Можете сделать скидку?",
  "Do you have a smaller size?|Есть размер поменьше?",
  "Can I try it on?|Можно примерить?",
  "I'm just looking, thanks.|Я просто смотрю, спасибо.",
  "I'll take it.|Беру."]},
 {cat:"Дорога и транспорт", items:[
  "Where is the toilet?|Где туалет?",
  "How do I get to the beach?|Как добраться до пляжа?",
  "Is it far from here?|Это далеко отсюда?",
  "Turn left. / Turn right.|Поверните налево. / Направо.",
  "Stop here, please.|Остановите здесь, пожалуйста.",
  "How much to the airport?|Сколько до аэропорта?",
  "Please use the meter.|Включите счётчик, пожалуйста."]},
 {cat:"Отель и жильё", items:[
  "I have a booking.|У меня бронь.",
  "What time is check-out?|Во сколько выезд?",
  "What's the Wi-Fi password?|Какой пароль от Wi‑Fi?",
  "The air conditioner doesn't work.|Кондиционер не работает.",
  "Can I have a clean towel?|Можно чистое полотенце?",
  "How much is the rent per month?|Сколько стоит аренда в месяц?"]},
 {cat:"Здоровье и помощь", items:[
  "Can you help me, please?|Помогите, пожалуйста.",
  "I need a doctor.|Мне нужен врач.",
  "Where is the nearest pharmacy?|Где ближайшая аптека?",
  "I have a headache.|У меня болит голова.",
  "Please call an ambulance.|Вызовите скорую, пожалуйста.",
  "I lost my phone.|Я потеряла телефон."]}
];

/* q item: [question, options, answerIndex, why]  b item: {b:"english sentence", ru:"russian"} */
const LESSONS = [
 {t:"to be: am / is / are", s:"«Я есть» — основа всего",
  ex:["По-русски мы говорим «Я устала», «Она врач» — без глагола. В английском между словами обязательно нужен глагол to be: am, is или are.",
      "I → am. He / she / it → is. You / we / they → are. В речи их сокращают: I'm, she's, they're."],
  f:"I am (I'm) · he / she / it is (he's)<br>you / we / they are (you're)",
  e:["I am tired.|Я устала.","She is a doctor.|Она врач.","We are from Russia.|Мы из России.","It is hot today.|Сегодня жарко."],
  q:[["I ___ happy.",["am","is","are"],0,"С I — всегда am."],
     ["My brother ___ in Moscow.",["am","is","are"],1,"Брат — это he, значит is."],
     ["They ___ my friends.",["is","are","am"],1,"They → are."],
     ["It ___ very hot.",["is","are","am"],0,"It → is."],
     ["Как сказать «Мы готовы»?",["We ready.","We are ready.","We is ready."],1,"Без are предложение неполное."],
     {b:"She is my sister.",ru:"Она моя сестра."},
     {b:"I am very tired.",ru:"Я очень устала."}]},
 {t:"to be: вопросы и «не»", s:"Are you…? I'm not…",
  ex:["Чтобы задать вопрос, ставим am / is / are в начало: You are ready → Are you ready?",
      "Отрицание — добавляем not: I am not (I'm not), he is not (isn't), they are not (aren't)."],
  f:"Are you OK? — Yes, I am. / No, I'm not.<br>Is it far? — Yes, it is. / No, it isn't.",
  e:["Are you busy?|Ты занята?","Is it expensive?|Это дорого?","I'm not hungry.|Я не голодна.","They aren't here.|Их здесь нет."],
  q:[["___ you from Russia?",["Is","Are","Am"],1,"С you — are, и он идёт в начало."],
     ["___ the shop open?",["Is","Are","Do"],0,"Shop — это it, значит Is."],
     ["I ___ not tired.",["am","is","are"],0,"I am not = I'm not."],
     ["The bananas ___ expensive.",["isn't","aren't","not"],1,"Бананов много, значит aren't."],
     ["Ответ на «Are you ready?»",["Yes, I am.","Yes, I'm.","Yes, I are."],0,"В кратком ответе не сокращают: Yes, I am."],
     {b:"Is it far from here?",ru:"Это далеко отсюда?"},
     {b:"I am not from here.",ru:"Я не отсюда."}]},
 {t:"I / me / my", s:"Я, меня, мой",
  ex:["I, you, he, she, it, we, they — кто делает действие.",
      "me, you, him, her, us, them — после глагола и предлога: help me, with him.",
      "my, your, his, her, our, their — чей: my phone, her name."],
  f:"I → me → my · you → you → your<br>he → him → his · she → her → her<br>we → us → our · they → them → their",
  e:["This is my friend.|Это мой друг.","Call me later.|Позвони мне позже.","What's her name?|Как её зовут?","I like them.|Они мне нравятся."],
  q:[["What's ___ name?",["you","your","yours"],1,"Чьё имя — your."],
     ["Can you help ___?",["I","my","me"],2,"После глагола — me."],
     ["This is Tom and ___ wife.",["his","he","him"],0,"Чья жена — his."],
     ["___ live in Phuket.",["Us","We","Our"],1,"Кто живёт — we."],
     ["I love ___. (их)",["they","their","them"],2,"После глагола — them."],
     {b:"Her name is Anna.",ru:"Её зовут Анна."},
     {b:"Please call me tomorrow.",ru:"Пожалуйста, позвони мне завтра."}]},
 {t:"Артикли a / an / the", s:"Маленькие, но важные",
  ex:["a / an — «какой-то, один из многих», говорим о предмете впервые. an — перед гласным звуком: an apple, an hour.",
      "the — конкретный, обоим понятно какой: the door (эта дверь), the sea.",
      "Без артикля — вещества и всё «вообще»: I like coffee. Water, please."],
  f:"a cat · an apple · the cat (тот самый)<br>coffee, water, people — часто без артикля",
  e:["I have a dog.|У меня есть собака.","The dog is black.|Эта собака чёрная.","It's an old house.|Это старый дом.","Close the door, please.|Закрой дверь, пожалуйста."],
  q:[["I want ___ apple.",["a","an","the"],1,"apple начинается с гласного звука."],
     ["She is ___ teacher.",["a","an","—"],0,"Профессия — с a."],
     ["Can you open ___ window? (вот это окно)",["a","an","the"],2,"Конкретное окно, понятно какое."],
     ["I like ___ coffee.",["a","the","— (без артикля)"],2,"Кофе вообще — без артикля."],
     ["It takes ___ hour.",["a","an","the"],1,"hour читается с гласного звука: an hour."],
     {b:"I have a big family.",ru:"У меня большая семья."},
     {b:"The beach is very beautiful.",ru:"Пляж очень красивый."}]},
 {t:"Много: cats, children", s:"Множественное число",
  ex:["Обычно добавляем -s: cat → cats, day → days. После s, sh, ch, x — -es: bus → buses, watch → watches.",
      "Исключения просто запоминаем: man → men, woman → women, child → children, person → people, foot → feet, tooth → teeth."],
  f:"one cat → two cats · one bus → two buses<br>one child → two children · one person → two people",
  e:["I have two brothers.|У меня два брата.","Three coffees, please.|Три кофе, пожалуйста.","The children are at school.|Дети в школе.","Many people live here.|Здесь живёт много людей."],
  q:[["two ___",["dog","dogs","doges"],1,"Обычное слово — просто -s."],
     ["three ___",["bus","buss","buses"],2,"После s добавляем -es."],
     ["many ___",["childs","children","childrens"],1,"child → children."],
     ["five ___",["persons","peoples","people"],2,"person → people."],
     ["My ___ hurt.",["foots","feet","feets"],1,"foot → feet."],
     {b:"I have two cats.",ru:"У меня две кошки."},
     {b:"The children are hungry.",ru:"Дети голодные."}]},
 {t:"this / that / these / those", s:"Это, то, эти, те",
  ex:["this — это (рядом), that — то (далеко). Если предметов много: these — эти, those — те.",
      "Очень пригодится в магазине: How much is this? How much are those?"],
  f:"this bag · that bag (вон там)<br>these bags · those bags (вон там)",
  e:["How much is this?|Сколько это стоит?","I like that dress.|Мне нравится то платье.","These are my keys.|Это мои ключи.","Are those your shoes?|Вон то — твоя обувь?"],
  q:[["___ is my friend Kate. (стоит рядом)",["This","These","Those"],0,"Один человек рядом — this."],
     ["How much are ___ shoes? (вон там)",["that","this","those"],2,"Много и далеко — those."],
     ["___ apples are fresh. (здесь)",["This","These","That"],1,"Много и рядом — these."],
     ["Look at ___ bird! (в небе)",["this","that","these"],1,"Одна и далеко — that."],
     ["Как спросить «Что это?» про предмет в руке?",["What is this?","What are this?","What is these?"],0,"Один предмет — What is this?"],
     {b:"How much is this?",ru:"Сколько это стоит?"},
     {b:"These shoes are too small.",ru:"Эти туфли слишком маленькие."}]},
 {t:"there is / there are", s:"Здесь есть…",
  ex:["Так говорят, что где-то что-то есть или находится: «Рядом есть аптека», «В номере две кровати».",
      "there is — для одного, there are — для многих. Вопрос: Is there…? Are there…?"],
  f:"There is a pharmacy near here.<br>There are two beds. · Is there Wi‑Fi?",
  e:["There is a cafe on the corner.|На углу есть кафе.","There are many tourists here.|Здесь много туристов.","Is there a bank near here?|Здесь рядом есть банк?","There isn't any water.|Нет воды."],
  q:[["___ a supermarket near here?",["Is there","Are there","There is"],0,"Вопрос про один магазин — Is there."],
     ["There ___ two rooms.",["is","are","be"],1,"Две комнаты — are."],
     ["There ___ a problem.",["is","are","am"],0,"Одна проблема — is."],
     ["___ any restaurants here?",["Is there","Are there","There are"],1,"Ресторанов много — Are there."],
     ["«В номере нет полотенец»",["There aren't any towels in the room.","There isn't any towels in the room."],0,"Полотенец много, значит aren't."],
     {b:"Is there a pharmacy near here?",ru:"Здесь рядом есть аптека?"},
     {b:"There are many people on the beach.",ru:"На пляже много людей."}]},
 {t:"have / has", s:"У меня есть…",
  ex:["«У меня есть» по-английски — I have. С he / she / it — has.",
      "Вопрос и отрицание — через do / does: Do you have…? I don't have… После does снова have, а не has."],
  f:"I / you / we / they have · he / she / it has<br>Do you have…? · She doesn't have…",
  e:["I have a question.|У меня есть вопрос.","She has two children.|У неё двое детей.","Do you have a pen?|У тебя есть ручка?","I don't have time.|У меня нет времени."],
  q:[["He ___ a new car.",["have","has","is"],1,"He → has."],
     ["___ you have Wi‑Fi?",["Do","Does","Are"],0,"С you — Do."],
     ["She doesn't ___ a phone.",["has","have","having"],1,"После doesn't — have."],
     ["We ___ a small house.",["has","have","are"],1,"We → have."],
     ["«У меня нет денег»",["I haven't money.","I don't have money.","I not have money."],1,"Обычно говорят I don't have."],
     {b:"Do you have a smaller size?",ru:"У вас есть размер поменьше?"},
     {b:"My sister has a cat.",ru:"У моей сестры есть кошка."}]},
 {t:"Present Simple", s:"Что я обычно делаю",
  ex:["Это время для привычек, расписаний и фактов: я работаю из дома, магазин открывается в 9.",
      "С I / you / we / they глагол не меняется. С he / she / it добавляем -s: she works, it opens. Особые: go → goes, do → does, have → has."],
  f:"I work · you work · they work<br>he works · she goes · it opens",
  e:["I live in Phuket.|Я живу на Пхукете.","She works in a hotel.|Она работает в отеле.","The shop opens at nine.|Магазин открывается в девять.","We usually eat at home.|Мы обычно едим дома."],
  q:[["She ___ English.",["speak","speaks","speaking"],1,"She → глагол с -s."],
     ["I ___ coffee every morning.",["drink","drinks","am drink"],0,"С I — без -s."],
     ["My brother ___ to the gym.",["go","goes","gos"],1,"go → goes."],
     ["The bus ___ at 7.",["leave","leaves","leaving"],1,"Автобус — это it, нужен -s."],
     ["They ___ near the beach.",["lives","live","living"],1,"They — без -s."],
     {b:"I work from home.",ru:"Я работаю из дома."},
     {b:"She lives in Bangkok.",ru:"Она живёт в Бангкоке."}]},
 {t:"Present Simple: вопросы и «не»", s:"Do you…? I don't…",
  ex:["Вопрос строим с do (I / you / we / they) или does (he / she / it): Do you like…? Does she work…?",
      "Отрицание — don't / doesn't. После does и doesn't глагол без -s: She doesn't eat meat."],
  f:"Do you speak English? · Does he live here?<br>I don't know. · She doesn't drink.",
  e:["Do you speak English?|Ты говоришь по-английски?","Does it hurt?|Больно?","I don't understand.|Я не понимаю.","He doesn't eat meat.|Он не ест мясо."],
  q:[["___ you like spicy food?",["Do","Does","Are"],0,"С you — Do."],
     ["___ she live here?",["Do","Does","Is"],1,"С she — Does."],
     ["He doesn't ___ coffee.",["drinks","drink","drinking"],1,"После doesn't — без -s."],
     ["I ___ know.",["don't","doesn't","not"],0,"С I — don't."],
     ["«Где ты работаешь?»",["Where you work?","Where do you work?","Where does you work?"],1,"Вопросительное слово + do you + глагол."],
     {b:"Do you speak Russian?",ru:"Ты говоришь по-русски?"},
     {b:"I don't eat meat.",ru:"Я не ем мясо."}]},
 {t:"Вопросы: what, where, how…", s:"Как задать вопрос",
  ex:["what — что, where — где / куда, when — когда, who — кто, why — почему, how — как, how much — сколько стоит, how many — сколько штук.",
      "Порядок: вопросительное слово + is / are / do / does + остальное: Where is the toilet? What do you want?"],
  f:"Where is…? · What time is it?<br>How much is it? · Why do you…?",
  e:["Where is the toilet?|Где туалет?","What time is it?|Который час?","How much is this?|Сколько это стоит?","Why are you sad?|Почему ты грустишь?"],
  q:[["___ is the bus stop?",["What","Where","Who"],1,"Где — where."],
     ["___ is that man?",["Who","What","How"],0,"Кто — who."],
     ["___ are you? — I'm fine.",["What","How","Where"],1,"Как дела — How are you?"],
     ["___ do you get up? — At seven.",["When","Who","Which"],0,"Когда — when."],
     ["___ is it? — 200 baht.",["How many","How much","How long"],1,"Цена — how much."],
     {b:"Where do you live?",ru:"Где ты живёшь?"},
     {b:"What time is it now?",ru:"Который сейчас час?"}]},
 {t:"in / on / at", s:"Где и когда",
  ex:["Место: in — внутри (in the bag, in Thailand), on — на поверхности (on the table), at — в точке, у (at home, at work, at the door).",
      "Время: at — точное время (at 6), on — дни (on Monday), in — месяцы, годы, части дня (in May, in the morning)."],
  f:"in the bag · on the table · at home<br>at 7 · on Friday · in July · in the morning",
  e:["My keys are in my bag.|Мои ключи в сумке.","The phone is on the table.|Телефон на столе.","I'm at home.|Я дома.","See you on Monday at 10.|Увидимся в понедельник в 10."],
  q:[["I live ___ Thailand.",["in","on","at"],0,"Страна — in."],
     ["Let's meet ___ 7 o'clock.",["in","on","at"],2,"Точное время — at."],
     ["The cup is ___ the table.",["in","on","at"],1,"На поверхности — on."],
     ["My birthday is ___ May.",["in","on","at"],0,"Месяц — in."],
     ["I'm ___ work now.",["in","on","at"],2,"at work — устойчивое сочетание."],
     {b:"I usually work in the morning.",ru:"Обычно я работаю утром."},
     {b:"The keys are on the table.",ru:"Ключи на столе."}]},
 {t:"Present Continuous", s:"Прямо сейчас",
  ex:["Для того, что происходит в момент речи: я сейчас готовлю, идёт дождь.",
      "Строим из am / is / are и глагола с окончанием -ing: I'm cooking, she is sleeping."],
  f:"I'm working · she is working · they are working<br>Are you working? · I'm not working.",
  e:["I'm cooking now.|Я сейчас готовлю.","She is waiting for a taxi.|Она ждёт такси.","Are you listening?|Ты слушаешь?","It's raining.|Идёт дождь."],
  q:[["Look! It ___.",["rains","is raining","rain"],1,"Look! — значит прямо сейчас."],
     ["What ___ you doing?",["do","are","is"],1,"you → are."],
     ["I ___ cooking dinner now.",["am","is","do"],0,"I → am."],
     ["She ___ sleeping.",["isn't","doesn't","don't"],0,"Отрицание — через is not."],
     ["«Обычно я пью чай, но сейчас пью кофе»",["I usually drink tea, but now I'm drinking coffee.","I usually am drinking tea, but now I drink coffee."],0,"Обычно — simple, сейчас — continuous."],
     {b:"I am waiting for a taxi.",ru:"Я жду такси."},
     {b:"What are you doing now?",ru:"Что ты сейчас делаешь?"}]},
 {t:"can / can't", s:"Могу, умею, можно",
  ex:["can — могу, умею, можно. После can глагол без to и без -s: She can swim.",
      "Просьбы и разрешение: Can I…? (Можно мне…?) Can you…? (Можете…?). «Не могу» — can't."],
  f:"I can swim · she can't drive<br>Can I pay by card? · Can you help me?",
  e:["I can speak a little English.|Я немного говорю по-английски.","Can I sit here?|Можно здесь сесть?","Can you help me?|Можете мне помочь?","I can't find my phone.|Не могу найти телефон."],
  q:[["___ I have the bill, please?",["Can","Do","Am"],0,"Просьба — Can I…?"],
     ["She can ___ very well.",["cooks","cook","to cook"],1,"После can — просто глагол."],
     ["I ___ hear you. The music is loud.",["can't","don't can","not can"],0,"Не могу — can't."],
     ["___ you speak slowly, please?",["Can","Are","Does"],0,"Просьба — Can you…?"],
     ["«Можно открыть окно?»",["Can I open the window?","Can I to open the window?","I can open the window?"],0,"Can I + глагол."],
     {b:"Can I pay by card?",ru:"Можно оплатить картой?"},
     {b:"I can't find my keys.",ru:"Я не могу найти ключи."}]},
 {t:"was / were", s:"Был, была, были",
  ex:["Прошедшее время от am / is — was, от are — were.",
      "I / he / she / it — was. You / we / they — were. Вопрос: Were you…? Was it…? Отрицание: wasn't, weren't."],
  f:"I was · she was · they were<br>Was it good? · We weren't at home.",
  e:["I was tired yesterday.|Вчера я устала.","The film was great.|Фильм был отличный.","Where were you?|Где ты была?","It wasn't expensive.|Это было недорого."],
  q:[["Yesterday I ___ at home.",["was","were","am"],0,"I → was."],
     ["We ___ in Bangkok last week.",["was","were","are"],1,"We → were."],
     ["___ the food good?",["Was","Were","Did"],0,"Еда — это it, значит Was."],
     ["They ___ at the party.",["wasn't","weren't","didn't"],1,"They → weren't."],
     ["«Где вы были?»",["Where you were?","Where were you?","Where was you?"],1,"Вопрос: Where were you?"],
     {b:"The weather was beautiful.",ru:"Погода была прекрасная."},
     {b:"Where were you yesterday?",ru:"Где ты была вчера?"}]},
 {t:"Past Simple", s:"Что я сделала",
  ex:["Правильные глаголы получают -ed: work → worked, watch → watched.",
      "Неправильные запоминаем: go → went, eat → ate, buy → bought, see → saw, have → had. В карточках слов они отмечены через «·».",
      "Вопрос и отрицание — через did, глагол в начальной форме: Did you see? I didn't go."],
  f:"I worked · I went<br>Did you go? · I didn't go.",
  e:["I watched a film yesterday.|Вчера я посмотрела фильм.","We went to the beach.|Мы ходили на пляж.","Did you eat?|Ты поела?","I didn't sleep well.|Я плохо спала."],
  q:[["Yesterday I ___ to the market.",["go","went","goed"],1,"go — неправильный: went."],
     ["___ you call him?",["Did","Do","Was"],0,"Вопрос о прошлом — Did."],
     ["I didn't ___ him.",["saw","see","seen"],1,"После didn't — начальная форма."],
     ["She ___ a new dress.",["buyed","bought","buy"],1,"buy → bought."],
     ["We ___ a film last night.",["watch","watched","watching"],1,"Правильный глагол: -ed."],
     {b:"I bought a new phone.",ru:"Я купила новый телефон."},
     {b:"Did you sleep well?",ru:"Ты хорошо спала?"}]},
 {t:"will / going to", s:"Будущее",
  ex:["will — решаем прямо сейчас, обещаем, предсказываем: I'll call you. It will rain.",
      "going to — план, который уже решён заранее: I'm going to visit Bangkok."],
  f:"I'll call you · Will you help?<br>I'm going to move · Are you going to…?",
  e:["I'll call you later.|Я позвоню тебе позже.","I'm going to visit Bangkok next week.|На следующей неделе я еду в Бангкок.","It will rain tomorrow.|Завтра будет дождь.","Will you help me?|Поможешь мне?"],
  q:[["The phone is ringing. — I ___ answer it!",["will","am going to"],0,"Решение в моменте — will."],
     ["We ___ move in December. We already booked it.",["will","are going to"],1,"Уже запланировано — going to."],
     ["I ___ send it tomorrow, I promise.",["will","going to","am"],0,"Обещание — will."],
     ["___ you come tomorrow?",["Will","Do","Are going"],0,"Вопрос о будущем: Will you…?"],
     ["«Она собирается купить машину»",["She will to buy a car.","She is going to buy a car.","She going to buy a car."],1,"Нужно is going to."],
     {b:"I will call you tomorrow.",ru:"Я позвоню тебе завтра."},
     {b:"We are going to visit Bangkok.",ru:"Мы собираемся поехать в Бангкок."}]},
 {t:"Сравнение: bigger, the best", s:"Больше, лучше, самый",
  ex:["Короткие прилагательные: + er (сравнение) и the + est (самый): cheap → cheaper → the cheapest. big → bigger (буква удваивается), easy → easier.",
      "Длинные — с more / the most: expensive → more expensive → the most expensive. «Чем» — than.",
      "Исключения: good → better → the best, bad → worse → the worst."],
  f:"cheap → cheaper than → the cheapest<br>expensive → more expensive → the most expensive<br>good → better → the best",
  e:["This room is bigger.|Эта комната больше.","A taxi is more expensive than a bus.|Такси дороже, чем автобус.","It's the best cafe in town.|Это лучшее кафе в городе.","Today is hotter than yesterday.|Сегодня жарче, чем вчера."],
  q:[["This bag is ___ than that one.",["cheap","cheaper","cheapest"],1,"Сравниваем два — cheaper than."],
     ["It's the ___ beach on the island.",["beautifulest","most beautiful","more beautiful"],1,"Длинное слово: the most…"],
     ["My English is ___ now.",["gooder","better","best"],1,"good → better."],
     ["Bangkok is ___ than Phuket.",["big","bigger","biggest"],1,"big → bigger."],
     ["«Это худший день»",["It's the worst day.","It's the baddest day."],0,"bad → the worst."],
     {b:"The sea is warmer than the pool.",ru:"Море теплее, чем бассейн."},
     {b:"This is the best coffee.",ru:"Это лучший кофе."}]}
];

/* dialog lines: [who, en, ru]  who: "a" = собеседник, "me" = ты */
const DIALOGS = [
 {t:"Знакомство", d:"Имя, откуда ты, чем занимаешься", l:[
  ["a","Hi! I'm Tom. What's your name?","Привет! Я Том. Как тебя зовут?"],
  ["me","Hi, Tom! I'm Anna. Nice to meet you.","Привет, Том! Я Анна. Приятно познакомиться."],
  ["a","Nice to meet you too. Where are you from?","Мне тоже. Откуда ты?"],
  ["me","I'm from Russia. And you?","Я из России. А ты?"],
  ["a","I'm from Australia. Do you live here?","Я из Австралии. Ты здесь живёшь?"],
  ["me","Yes, I live in the Old Town.","Да, я живу в Старом городе."],
  ["a","Cool! What do you do?","Здорово! Чем ты занимаешься?"],
  ["me","I'm a designer. I work online.","Я дизайнер. Работаю онлайн."]]},
 {t:"В кафе", d:"Заказать еду и напиток", l:[
  ["a","Hello! Are you ready to order?","Здравствуйте! Готовы сделать заказ?"],
  ["me","Yes. Can I have the chicken with rice, please?","Да. Можно курицу с рисом?"],
  ["a","Sure. Spicy or not spicy?","Конечно. Остро или не остро?"],
  ["me","A little spicy, please.","Немного остро, пожалуйста."],
  ["a","Anything to drink?","Что-нибудь выпить?"],
  ["me","An iced coffee, no sugar.","Холодный кофе без сахара."],
  ["a","Okay. Anything else?","Хорошо. Что-нибудь ещё?"],
  ["me","No, thank you. That's all.","Нет, спасибо. Это всё."]]},
 {t:"Попросить счёт", d:"Оплата, сдача, комплимент кухне", l:[
  ["me","Excuse me, can I have the bill, please?","Извините, можно счёт?"],
  ["a","Of course. That's two hundred and fifty baht.","Конечно. С вас двести пятьдесят бат."],
  ["me","Can I pay by card?","Можно картой?"],
  ["a","Sorry, cash only.","Извините, только наличные."],
  ["me","No problem. Here you are.","Без проблем. Вот, пожалуйста."],
  ["a","Thank you! Here is your change.","Спасибо! Вот ваша сдача."],
  ["me","Thanks. The food was delicious!","Спасибо. Еда была очень вкусная!"]]},
 {t:"Магазин одежды", d:"Цена, размер, примерка", l:[
  ["a","Hi! Can I help you?","Здравствуйте! Вам помочь?"],
  ["me","Yes, how much is this dress?","Да, сколько стоит это платье?"],
  ["a","It's eight hundred baht.","Восемьсот бат."],
  ["me","Do you have a smaller size?","Есть размер поменьше?"],
  ["a","Yes, here you are.","Да, вот, пожалуйста."],
  ["me","Can I try it on?","Можно примерить?"],
  ["a","Sure. The fitting room is over there.","Конечно. Примерочная вон там."],
  ["me","It's perfect. I'll take it.","Идеально. Беру."]]},
 {t:"Спросить дорогу", d:"Где аптека и далеко ли идти", l:[
  ["me","Excuse me, where is the nearest pharmacy?","Извините, где ближайшая аптека?"],
  ["a","Go straight and turn left at the corner.","Идите прямо и на углу поверните налево."],
  ["me","Is it far?","Это далеко?"],
  ["a","No, it's about five minutes on foot.","Нет, минут пять пешком."],
  ["me","Sorry, can you say it again, please?","Простите, можете повторить?"],
  ["a","Straight, then left. Five minutes.","Прямо, потом налево. Пять минут."],
  ["me","Thank you very much!","Большое спасибо!"],
  ["a","You're welcome.","Пожалуйста."]]},
 {t:"Такси", d:"Куда ехать, цена, сколько по времени", l:[
  ["a","Hello! Where to?","Здравствуйте! Куда едем?"],
  ["me","To the airport, please. How much is it?","В аэропорт, пожалуйста. Сколько стоит?"],
  ["a","Six hundred baht.","Шестьсот бат."],
  ["me","That's too expensive. Can you use the meter?","Это слишком дорого. Можете включить счётчик?"],
  ["a","Okay, okay. Five hundred.","Ладно, ладно. Пятьсот."],
  ["me","Okay. How long does it take?","Хорошо. Сколько ехать?"],
  ["a","About forty minutes.","Минут сорок."],
  ["me","Great, thank you.","Отлично, спасибо."]]},
 {t:"Заселение в отель", d:"Бронь, номер, завтрак, Wi‑Fi", l:[
  ["me","Hello! I have a booking. My name is Anna.","Здравствуйте! У меня бронь. Меня зовут Анна."],
  ["a","Welcome! Can I see your passport, please?","Добро пожаловать! Можно ваш паспорт?"],
  ["me","Here you are.","Вот, пожалуйста."],
  ["a","Thank you. Your room is on the third floor.","Спасибо. Ваш номер на третьем этаже."],
  ["me","What time is breakfast?","Во сколько завтрак?"],
  ["a","From seven to ten.","С семи до десяти."],
  ["me","And what's the Wi-Fi password?","А какой пароль от Wi‑Fi?"],
  ["a","It's on your key card.","Он на вашей карточке-ключе."]]},
 {t:"В аптеке", d:"Что болит и как принимать", l:[
  ["a","Hello. How can I help you?","Здравствуйте. Чем могу помочь?"],
  ["me","I have a headache and a sore throat.","У меня болит голова и горло."],
  ["a","Do you have a fever?","У вас есть температура?"],
  ["me","No, I don't think so.","Нет, кажется, нет."],
  ["a","Take these. One tablet three times a day.","Принимайте эти. По одной таблетке три раза в день."],
  ["me","Before or after food?","До еды или после?"],
  ["a","After food.","После еды."],
  ["me","Thank you. How much is it?","Спасибо. Сколько с меня?"]]},
 {t:"Разговор о погоде", d:"Small talk с соседом", l:[
  ["a","Hot today, isn't it?","Сегодня жарко, правда?"],
  ["me","Yes, very hot! But I like it.","Да, очень! Но мне нравится."],
  ["a","Are you here on holiday?","Вы здесь в отпуске?"],
  ["me","No, I live here now.","Нет, я теперь здесь живу."],
  ["a","Really? How long have you been here?","Правда? И давно вы здесь?"],
  ["me","About a year.","Около года."],
  ["a","Do you like it?","Вам нравится?"],
  ["me","Yes, very much. But the rainy season is hard.","Да, очень. Но сезон дождей тяжёлый."]]},
 {t:"Аренда байка", d:"Срок, цена, шлем, залог", l:[
  ["me","Hi! I want to rent a bike.","Привет! Хочу арендовать байк."],
  ["a","For how long?","На какой срок?"],
  ["me","For one month. How much is it?","На месяц. Сколько стоит?"],
  ["a","Three thousand baht a month.","Три тысячи бат в месяц."],
  ["me","Is a helmet included?","Шлем входит?"],
  ["a","Yes. And I need your passport as a deposit.","Да. И мне нужен ваш паспорт в залог."],
  ["me","Can I leave cash instead?","Можно вместо этого оставить наличные?"],
  ["a","Okay, a two thousand baht deposit.","Хорошо, залог две тысячи бат."]]},
 {t:"Забронировать столик", d:"Телефонный звонок в ресторан", l:[
  ["a","Hello, Sea View restaurant.","Алло, ресторан «Си Вью»."],
  ["me","Hi! I'd like to book a table for tonight.","Здравствуйте! Хочу забронировать столик на вечер."],
  ["a","For how many people?","На сколько человек?"],
  ["me","For two, at eight o'clock.","На двоих, на восемь."],
  ["a","Okay. What's your name?","Хорошо. Как вас зовут?"],
  ["me","Anna. A, N, N, A.","Анна. A, N, N, A."],
  ["a","Thank you, Anna. See you tonight!","Спасибо, Анна. До вечера!"]]}
];

const SCENARIOS = [
 {t:"В кафе", d:"Заказ, вопросы про меню, счёт", role:"You play a waiter at a small cafe in a Thai tourist town. The learner is a customer. Start by greeting them and offering the menu."},
 {t:"В магазине", d:"Цена, размер, скидка", role:"You are a shop assistant in a clothes shop. The learner is a customer. Start by greeting them and asking if they need help."},
 {t:"Спросить дорогу", d:"Где что находится и как дойти", role:"You are a friendly local on the street. The learner is lost and will ask you for directions. Start by asking if they need help."},
 {t:"Такси", d:"Куда ехать, цена, остановки", role:"You are a taxi driver. The learner is your passenger. Start by asking where they want to go."},
 {t:"Новый знакомый", d:"Познакомиться и поболтать", role:"You are a friendly traveller the learner just met at a cafe. Start by saying hello and introducing yourself."},
 {t:"С Манго", d:"Болтовня обо всём с дерзким фруктом", role:"No role-play: you are just Mango, chatting about anything — the learner's day, plans, films, life. Start by greeting the learner in your style and asking how their day is going."}
];

/* ================= COURSE STRUCTURE (block 1 «Основы» + start of block 2) =================
   Lessons are stored by id. Exercise kinds:
   [question, options, answerIndex, why]           — choose
   {b:"english sentence", ru:"russian"}           — build the sentence from words
   {t:"type", q:"She ___ to work. (go)", a:["goes"], why} — type the missing form
   {t:"fix", s:"She go to work", w:1, r:"goes", why}      — tap the wrong word (r:"" means the word is extra) */

/* ids of the original 18 lessons, in their old order (used to move saved progress) */
const OLD_IDS = ["be","beq","pron","art","plural","this","there","have","ps","psq","wh","prep","pc","can","was","past","future","comp"];
LESSONS.forEach((L, i) => { L.id = OLD_IDS[i]; });

const EXTRA = {
 be:[{t:"type",q:"They ___ from Thailand. (be)",a:["are"],why:"They → are."},
     {t:"type",q:"I ___ a designer. (be)",a:["am"],why:"I → am."},
     {t:"fix",s:"My sister are a doctor",w:2,r:"is",why:"Сестра — это she, значит is."}],
 beq:[{t:"type",q:"___ you hungry? (be)",a:["are"],why:"Вопрос с you: Are you…?"},
     {t:"type",q:"It ___ cold today. (be + «не»)",a:["isn't","is not"],why:"It is not = it isn't."},
     {t:"fix",s:"Is they at home?",w:0,r:"Are",why:"They → are, и в вопросе тоже."}],
 pron:[{t:"type",q:"This is ___ bag. (я → мой)",a:["my"],why:"Мой — my."},
     {t:"type",q:"Can you call ___? (она → её)",a:["her"],why:"После глагола — her."},
     {t:"fix",s:"Him name is Tom",w:0,r:"His",why:"Чьё имя — his. Him — это «его» после глагола: call him."}],
 plural:[{t:"type",q:"two ___ (child)",a:["children"],why:"child → children."},
     {t:"type",q:"three ___ (box)",a:["boxes"],why:"После x добавляем -es."},
     {t:"fix",s:"I have two sisteres",w:3,r:"sisters",why:"Обычное слово — просто -s."}],
 this:[{t:"type",q:"___ are my keys. (эти, рядом)",a:["these"],why:"Много и рядом — these."},
     {t:"type",q:"Look at ___ mountain! (та, далеко)",a:["that"],why:"Одна и далеко — that."},
     {t:"fix",s:"How much are this shoes?",w:3,r:"these",why:"Обуви «много» и она рядом — these."}],
 art:[{t:"type",q:"I want ___ ice cream. (a / an)",a:["an"],why:"ice начинается с гласного звука."},
     {t:"type",q:"Close ___ door, please. (a / the)",a:["the"],why:"Понятно, какая дверь — the."},
     {t:"fix",s:"She is a engineer",w:2,r:"an",why:"engineer начинается с гласного звука — an."}],
 there:[{t:"type",q:"There ___ two beds in the room. (is / are)",a:["are"],why:"Две кровати — are."},
     {t:"type",q:"___ there a bank near here? (is / are)",a:["is"],why:"Один банк — Is there…?"},
     {t:"fix",s:"There is many cafes here",w:1,r:"are",why:"Кафе много — there are."}],
 have:[{t:"type",q:"She ___ a cat. (have)",a:["has"],why:"She → has."},
     {t:"type",q:"___ you have a pen? (do / does)",a:["do"],why:"С you — Do."},
     {t:"fix",s:"He don't have a car",w:1,r:"doesn't",why:"He → doesn't."}],
 ps:[{t:"type",q:"He ___ in a bank. (work)",a:["works"],why:"He → глагол с -s."},
     {t:"type",q:"My mum ___ TV every evening. (watch)",a:["watches"],why:"После ch добавляем -es."},
     {t:"fix",s:"She live in Phuket",w:1,r:"lives",why:"She → глагол с -s."}],
 psq:[{t:"type",q:"___ he speak English? (do / does)",a:["does"],why:"С he — Does."},
     {t:"type",q:"I ___ like coffee. (do + «не»)",a:["don't","do not"],why:"С I — don't."},
     {t:"fix",s:"Does she works here?",w:2,r:"work",why:"После does — глагол без -s."}],
 wh:[{t:"type",q:"___ old are you? (сколько лет)",a:["how"],why:"Возраст: How old…?"},
     {t:"type",q:"___ is your birthday? (когда)",a:["when"],why:"Когда — when."},
     {t:"fix",s:"Where you live?",w:1,r:"do you",why:"Нужен помощник do: Where do you live?"}],
 prep:[{t:"type",q:"See you ___ Monday. (in / on / at)",a:["on"],why:"Дни недели — on."},
     {t:"type",q:"I was born ___ 1995. (in / on / at)",a:["in"],why:"Год — in."},
     {t:"fix",s:"The film starts in 8 o'clock",w:3,r:"at",why:"Точное время — at."}],
 pc:[{t:"type",q:"She ___ now. (sleep)",a:["is sleeping","'s sleeping"],why:"Сейчас — is + -ing."},
     {t:"type",q:"They ___ a film now. (watch)",a:["are watching","'re watching"],why:"They → are + -ing."},
     {t:"fix",s:"I am work now",w:2,r:"working",why:"После am нужен глагол с -ing."}],
 can:[{t:"type",q:"I ___ swim. (не умею)",a:["can't","cannot"],why:"Не могу, не умею — can't."},
     {t:"type",q:"___ I sit here? (можно)",a:["can"],why:"Разрешение — Can I…?"},
     {t:"fix",s:"She cans drive",w:1,r:"can",why:"can не меняется: без -s."}],
 was:[{t:"type",q:"I ___ at home yesterday. (be)",a:["was"],why:"I → was."},
     {t:"type",q:"___ you at the party? (be)",a:["were"],why:"You → were."},
     {t:"fix",s:"They was very tired",w:1,r:"were",why:"They → were."}],
 past:[{t:"type",q:"I ___ a new phone yesterday. (buy)",a:["bought"],why:"buy → bought."},
     {t:"type",q:"We ___ to the beach last week. (go)",a:["went"],why:"go → went."},
     {t:"fix",s:"Did you saw the film?",w:2,r:"see",why:"После did — начальная форма."}],
 future:[{t:"type",q:"I ___ call you tomorrow. (обещаю)",a:["will","'ll"],why:"Обещание — will."},
     {t:"type",q:"She ___ going to buy a car. (be)",a:["is","'s"],why:"She → is going to."},
     {t:"fix",s:"I will helps you",w:2,r:"help",why:"После will — начальная форма."}],
 comp:[{t:"type",q:"Bangkok is ___ than Phuket. (big)",a:["bigger"],why:"big → bigger."},
     {t:"type",q:"It's the ___ day of my life! (good)",a:["best"],why:"good → the best."},
     {t:"fix",s:"This hotel is cheapest than that one",w:3,r:"cheaper",why:"Сравниваем два — cheaper than."}],
};
LESSONS.forEach(L => { if(EXTRA[L.id]) L.q.push(...EXTRA[L.id]); });

const NEW_LESSONS = [
 {id:"poss",t:"Притяжательный 's",s:"Анин телефон, мамина машина",
  ex:["Чтобы сказать «чей», к имени или человеку добавляем 's: Anna's phone — телефон Анны, my mum's car — машина моей мамы.",
      "Если слово во множественном числе уже кончается на -s, ставим только апостроф: my parents' house — дом моих родителей. У особых слов без -s — обычный 's: children's, people's."],
  f:"Anna's phone · my brother's car<br>my parents' house · the children's room",
  e:["This is Anna's phone.|Это телефон Анны.","My brother's car is red.|Машина моего брата красная.","My parents' house is big.|Дом моих родителей большой.","What's your friend's name?|Как зовут твою подругу?"],
  q:[["«Это машина Тома»",["This is Tom car.","This is Tom's car.","This is car Tom's."],1,"Чья — Tom's, и сразу за ним предмет."],
     ["My ___ name is Olga.",["mother","mother's","mothers"],1,"Имя мамы — mother's name."],
     ["The ___ toys are everywhere. (детей)",["children's","childrens'","childs'"],0,"children — особое слово: children's."],
     ["This is my ___ house. (родителей)",["parents's","parents'","parent's"],1,"parents уже на -s — только апостроф."],
     ["Whose bag is it? — It's ___.",["Kate's","Kate","of Kate"],0,"Чья? — Kate's."],
     {t:"type",q:"This is ___ room. (my sister)",a:["my sister's"],why:"my sister + 's."},
     {t:"type",q:"What is your ___ job? (father)",a:["father's"],why:"father + 's."},
     {t:"fix",s:"It is my friends car",w:3,r:"friend's",why:"Машина друга — friend's car, нужен 's."},
     {b:"This is my brother's bike.",ru:"Это байк моего брата."},
     {b:"What is your mother's name?",ru:"Как зовут твою маму?"}]},
 {id:"some",t:"some / any",s:"Немного, какие-нибудь",
  ex:["some — «немного, несколько», в утверждениях: I have some money. There are some apples.",
      "any — в вопросах и отрицаниях: Do you have any questions? I don't have any money.",
      "В просьбах и предложениях — снова some, хоть это и вопрос: Can I have some water? Would you like some tea?"],
  f:"I have some time. · I don't have any time.<br>Do you have any time? · Can I have some water?",
  e:["There are some cafes near here.|Рядом есть несколько кафе.","I don't have any cash.|У меня совсем нет наличных.","Do you have any questions?|У вас есть вопросы?","Can I have some water, please?|Можно немного воды?"],
  q:[["I need ___ help.",["some","any"],0,"Утверждение — some."],
     ["We don't have ___ milk.",["some","any"],1,"Отрицание — any."],
     ["Are there ___ shops near here?",["some","any"],1,"Вопрос — any."],
     ["Would you like ___ coffee?",["some","any"],0,"Предложение — some, хоть это и вопрос."],
     ["There aren't ___ taxis.",["some","any"],1,"Отрицание — any."],
     {t:"type",q:"I bought ___ fruit at the market. (some / any)",a:["some"],why:"Утверждение — some."},
     {t:"type",q:"Do you have ___ brothers? (some / any)",a:["any"],why:"Вопрос — any."},
     {t:"fix",s:"I don't have some money",w:3,r:"any",why:"В отрицании — any."},
     {b:"Can I have some water?",ru:"Можно немного воды?"},
     {b:"I don't have any questions.",ru:"У меня нет вопросов."}]},
 {id:"many",t:"much / many / a lot of",s:"Много чего?",
  ex:["many — с тем, что можно посчитать: many people, many days. much — с тем, что не считается: much time, much money.",
      "much и many чаще всего в вопросах и отрицаниях: How many…? How much…? I don't have much time.",
      "В обычных утверждениях проще сказать a lot of — подходит ко всему: a lot of people, a lot of money."],
  f:"How many people? · How much money?<br>I don't have much time. · a lot of friends",
  e:["How many brothers do you have?|Сколько у тебя братьев?","How much is it?|Сколько это стоит?","I don't have much time.|У меня мало времени.","There are a lot of tourists here.|Здесь много туристов."],
  q:[["How ___ people are there?",["much","many"],1,"Людей можно посчитать — many."],
     ["How ___ water do you drink?",["much","many"],0,"Воду не посчитать — much."],
     ["I don't have ___ friends here.",["much","many"],1,"Друзей считаем — many."],
     ["She drinks ___ coffee.",["a lot of","many"],0,"Кофе не считается, а в утверждении удобнее a lot of."],
     ["We don't have ___ time.",["much","many"],0,"Время не считается — much."],
     {t:"type",q:"How ___ is this T-shirt? (цена)",a:["much"],why:"Цена — How much…?"},
     {t:"type",q:"There are a ___ of cars on the road. (много)",a:["lot"],why:"a lot of cars."},
     {t:"fix",s:"How much days are you here?",w:1,r:"many",why:"Дни можно посчитать — many."},
     {b:"How many people live here?",ru:"Сколько людей здесь живёт?"},
     {b:"I don't have much money.",ru:"У меня мало денег."}]},
 {id:"imp",t:"Open! Don't… Let's…",s:"Просьбы, запреты, предложения",
  ex:["Чтобы попросить или сказать, что сделать, просто начинаем с глагола: Open the window. Sit down. Добавь please — и это вежливая просьба.",
      "«Не делай» — Don't + глагол: Don't worry. Don't touch it. Предложить что-то вместе — Let's + глагол: Let's go!"],
  f:"Open the door, please. · Don't worry!<br>Let's eat. · Let's not go.",
  e:["Turn left at the corner.|На углу поверните налево.","Please wait here.|Подождите здесь, пожалуйста.","Don't forget your passport.|Не забудь паспорт.","Let's take a taxi.|Давай возьмём такси."],
  q:[["«Не переживай!»",["Not worry!","Don't worry!","No worry!"],1,"Не делай — Don't + глагол."],
     ["«Давай пойдём на пляж»",["Let's go to the beach.","Let go to the beach.","We go to the beach!"],0,"Предложение — Let's + глагол."],
     ["___ the window, please.",["Opening","Open","To open"],1,"Просьба начинается с глагола без to."],
     ["___ touch it! It's hot!",["Don't","Not","No"],0,"Запрет — Don't."],
     ["«Говорите медленнее, пожалуйста»",["Speak slowly, please.","You speak slowly please.","Speaking slowly, please."],0,"Просьба — просто глагол."],
     {t:"type",q:"___ forget your keys! (не)",a:["don't","do not"],why:"Don't + глагол."},
     {t:"type",q:"___ have lunch together. (давай)",a:["let's","let us"],why:"Let's + глагол."},
     {t:"fix",s:"Not smoke here, please",w:0,r:"Don't",why:"Запрет — Don't smoke."},
     {b:"Please call me later.",ru:"Пожалуйста, позвони мне позже."},
     {b:"Don't be late.",ru:"Не опаздывай."}]},
 {id:"freq",t:"always, usually, never",s:"Как часто",
  ex:["Слова «как часто»: always — всегда, usually — обычно, often — часто, sometimes — иногда, never — никогда.",
      "Ставим их перед глаголом: I usually get up at 8. Но после am / is / are: She is always late.",
      "never — уже отрицание, второе «не» не нужно: I never eat meat (а не I don't never)."],
  f:"always · usually · often · sometimes · never<br>I usually walk. · He is always busy.",
  e:["I always drink coffee in the morning.|Утром я всегда пью кофе.","We sometimes cook at home.|Иногда мы готовим дома.","She is never late.|Она никогда не опаздывает.","Do you often go to the beach?|Ты часто ходишь на пляж?"],
  q:[["Где правильно?",["I go usually to the gym.","I usually go to the gym.","Usually I to the gym go."],1,"Перед глаголом: I usually go."],
     ["Где правильно?",["He always is tired.","He is always tired.","Always he tired."],1,"После is: is always."],
     ["«Я никогда не пью пиво»",["I never drink beer.","I don't never drink beer.","I never don't drink beer."],0,"never уже значит «не»."],
     ["How often do you cook? — ___, maybe once a week.",["Always","Sometimes","Never"],1,"Раз в неделю — sometimes."],
     ["They ___ late. (часто)",["are often","often are","often"],0,"После are: are often."],
     {t:"type",q:"I ___ sleep eight hours. (обычно)",a:["usually"],why:"usually — перед глаголом."},
     {t:"type",q:"She is ___ happy. (всегда)",a:["always"],why:"После is."},
     {t:"fix",s:"I don't never eat meat",w:1,r:"",why:"never уже отрицание — don't лишнее: I never eat meat."},
     {b:"I usually get up at seven.",ru:"Обычно я встаю в семь."},
     {b:"We never eat meat.",ru:"Мы никогда не едим мясо."}]},
 {id:"likeing",t:"like / love / hate + -ing",s:"Что мне нравится делать",
  ex:["После like, love, hate, enjoy действие обычно стоит с -ing: I like swimming. She loves cooking. I hate waiting.",
      "Вопрос и отрицание — как в Present Simple: Do you like dancing? He doesn't like flying.",
      "Не путай с would like — «хотела бы» прямо сейчас: I'd like a coffee. Это отдельный урок."],
  f:"I like reading. · She loves cooking.<br>Do you like dancing? · I hate getting up early.",
  e:["I love swimming in the sea.|Я обожаю плавать в море.","He doesn't like flying.|Он не любит летать.","Do you enjoy cooking?|Тебе нравится готовить?","I hate waiting.|Ненавижу ждать."],
  q:[["I like ___.",["read","reading","reads"],1,"После like — -ing."],
     ["She loves ___ photos.",["taking","take","takes"],0,"loves + -ing."],
     ["Do you enjoy ___?",["dance","dancing","to dancing"],1,"enjoy + -ing."],
     ["He ___ like running.",["don't","doesn't","isn't"],1,"He → doesn't."],
     ["«Я ненавижу рано вставать»",["I hate get up early.","I hate getting up early.","I hating get up early."],1,"hate + -ing."],
     {t:"type",q:"I love ___ in the sea. (swim)",a:["swimming"],why:"swim → swimming: m удваивается."},
     {t:"type",q:"Do you like ___? (cook)",a:["cooking"],why:"like + -ing."},
     {t:"fix",s:"She likes dance very much",w:2,r:"dancing",why:"likes + -ing."},
     {b:"I like walking in the evening.",ru:"Я люблю гулять вечером."},
     {b:"Do you like watching films?",ru:"Тебе нравится смотреть фильмы?"}]},
 {id:"pspc",t:"Simple или Continuous?",s:"Обычно или прямо сейчас",
  ex:["Present Simple — то, что бывает обычно, регулярно, всегда: I work from home. It rains a lot in October.",
      "Present Continuous — то, что идёт сейчас или в эти дни: I'm working now. It's raining.",
      "Подсказки: usually, every day, often → Simple. now, at the moment, today, Look! → Continuous.",
      "Глаголы like, love, want, know, understand почти всегда в Simple: I want a coffee (а не I'm wanting)."],
  f:"I usually walk, but today I'm taking a taxi.<br>She works in a hotel. · She's working now.",
  e:["I usually work from home, but today I'm working in a cafe.|Обычно я работаю из дома, но сегодня — в кафе.","It's raining. Take an umbrella.|Идёт дождь. Возьми зонт.","She speaks three languages.|Она говорит на трёх языках.","What are you doing now?|Что ты сейчас делаешь?"],
  q:[["Look! The baby ___.",["sleeps","is sleeping"],1,"Look! — прямо сейчас."],
     ["My brother ___ in a bank.",["works","is working"],0,"Где работает вообще — Simple."],
     ["I ___ what you mean.",["understand","am understanding"],0,"understand не бывает с -ing."],
     ["Shh! I ___ to music.",["listen","am listening"],1,"Прямо сейчас — Continuous."],
     ["We ___ to the gym every day.",["go","are going"],0,"every day — Simple."],
     {t:"type",q:"She usually ___ tea. (drink)",a:["drinks"],why:"usually — Simple, she → -s."},
     {t:"type",q:"Right now I ___ dinner. (cook)",a:["am cooking","'m cooking"],why:"Right now — am + -ing."},
     {t:"fix",s:"Look! It rains",w:2,r:"is raining",why:"Look! — значит прямо сейчас: It is raining."},
     {b:"What are you doing now?",ru:"Что ты сейчас делаешь?"},
     {b:"I usually walk to work.",ru:"Обычно я хожу на работу пешком."}]},
 {id:"wouldlike",t:"would like / want",s:"Вежливо «хочу»",
  ex:["want — «хочу», прямо и просто. Среди друзей нормально, но официанту или продавцу вежливее сказать I'd like (= I would like).",
      "I'd like + предмет: I'd like a coffee. I'd like + to + действие: I'd like to book a table.",
      "Предложить: Would you like some tea? — Yes, please. / No, thank you."],
  f:"I'd like a coffee, please. · I'd like to pay.<br>Would you like…? — Yes, please.",
  e:["I'd like the chicken, please.|Мне курицу, пожалуйста.","I'd like to book a table.|Я хочу забронировать столик.","Would you like some water?|Хотите воды?","I want to go home.|Я хочу домой."],
  q:[["Вежливо официанту: «Мне кофе»",["I want coffee.","I'd like a coffee, please.","Give coffee."],1,"Вежливо — I'd like."],
     ["I'd like ___ a room for two nights.",["book","to book","booking"],1,"I'd like + to + глагол."],
     ["___ you like some tea? (предлагаем)",["Do","Would","Are"],1,"Предложение — Would you like…?"],
     ["Would you like some cake? — ___",["Yes, I like.","Yes, please.","Yes, I would like."],1,"Короткий вежливый ответ — Yes, please."],
     ["«Я хотела бы заплатить картой»",["I'd like to pay by card.","I like to pay by card.","I'd like pay by card."],0,"I'd like to + глагол. А I like — это «мне нравится»."],
     {t:"type",q:"___ you like a drink? (предложи)",a:["would"],why:"Would you like…?"},
     {t:"type",q:"I'd like ___ see the menu.",a:["to"],why:"I'd like to + глагол."},
     {t:"fix",s:"I would like book a table",w:3,r:"to book",why:"После would like — to + глагол."},
     {b:"I'd like to pay, please.",ru:"Я хотела бы заплатить."},
     {b:"Would you like some coffee?",ru:"Хотите кофе?"}]},
 {id:"r1",review:true,t:"Повторение: я и мир",s:"Темы 1–6 вперемешку",
  ex:["Нового правила нет — только практика. to be, местоимения, множественное число, this / that и артикли вперемешку, как в настоящей речи."],
  f:"I am · you are · she is<br>my / me · cat → cats · this / these · a / an / the",
  e:["We are from Russia.|Мы из России.","Is this your bag?|Это твоя сумка?","These are my friends.|Это мои друзья.","She is an artist.|Она художница."],
  q:[["___ your sister at home?",["Is","Are","Am"],0,"Сестра — she → Is."],
     ["Those ___ my shoes.",["is","are"],1,"Those — много → are."],
     ["I have three ___.",["child","childs","children"],2,"child → children."],
     ["Can you help ___?",["we","us","our"],1,"После глагола — us."],
     ["It's ___ old house.",["a","an"],1,"old начинается с гласного звука — an."],
     {t:"type",q:"They ___ not hungry. (be)",a:["are"],why:"They → are."},
     {t:"type",q:"___ is my phone. (это, рядом)",a:["this"],why:"Один предмет рядом — this."},
     {t:"fix",s:"Her are my friends",w:0,r:"They",why:"Кто? Они — They are my friends."},
     {b:"Is this your phone?",ru:"Это твой телефон?"},
     {b:"We are not tired.",ru:"Мы не устали."}]},
 {id:"r2",review:true,t:"Повторение: что у меня есть",s:"Темы 8–13 вперемешку",
  ex:["Нового правила нет — только практика. there is / are, have / has, 's, some / any, much / many и просьбы вперемешку."],
  f:"there is / there are · have / has<br>Anna's · some / any · much / many · Don't…",
  e:["There is a pharmacy near here.|Рядом есть аптека.","She has two brothers.|У неё два брата.","Do you have any water?|У тебя есть вода?","Don't forget my brother's birthday.|Не забудь про день рождения моего брата."],
  q:[["There ___ a lot of people here.",["is","are"],1,"Людей много — are."],
     ["My friend ___ a dog.",["have","has"],1,"Друг — he или she → has."],
     ["Is there ___ milk?",["some","any"],1,"Вопрос — any."],
     ["How ___ money do you need?",["much","many"],0,"Деньги не считаем — much."],
     ["___ worry, it's OK.",["Don't","Not"],0,"Don't + глагол."],
     {t:"type",q:"This is ___ car. (my dad)",a:["my dad's"],why:"my dad + 's."},
     {t:"type",q:"___ there any cafes here? (is / are)",a:["are"],why:"Кафе много — Are there…?"},
     {t:"fix",s:"She have many friends",w:1,r:"has",why:"She → has."},
     {b:"There are some shops near here.",ru:"Рядом есть несколько магазинов."},
     {b:"Let's buy some fruit.",ru:"Давай купим фруктов."}]},
 {id:"r3",review:true,t:"Повторение: мой день",s:"Темы 15–20 вперемешку",
  ex:["Нового правила нет — только практика. Present Simple, вопросы, always / never, like + -ing и in / on / at вперемешку."],
  f:"she works · Do you…? · He doesn't…<br>always / usually / never · like + -ing · in / on / at",
  e:["She usually works at home.|Обычно она работает дома.","What do you do on Sundays?|Что ты делаешь по воскресеньям?","I love cooking in the evening.|Я люблю готовить вечером.","He never drinks coffee at night.|Он никогда не пьёт кофе вечером."],
  q:[["___ she live near the beach?",["Do","Does"],1,"she → Does."],
     ["I ___ eat fish.",["never","don't never"],0,"never — уже «не»."],
     ["We meet ___ Fridays.",["in","on","at"],1,"Дни — on."],
     ["He likes ___ films.",["watch","watching"],1,"likes + -ing."],
     ["___ do you live? — In Phuket.",["Where","When","Who"],0,"Где — where."],
     {t:"type",q:"My dad ___ to work by bike. (go)",a:["goes"],why:"go → goes."},
     {t:"type",q:"___ do you get up? — At seven. (когда)",a:["when","what time"],why:"Когда — when (или what time)."},
     {t:"fix",s:"She don't like cooking",w:1,r:"doesn't",why:"She → doesn't."},
     {b:"What time do you usually get up?",ru:"Во сколько ты обычно встаёшь?"},
     {b:"I love walking on the beach.",ru:"Я люблю гулять по пляжу."}]},
 {id:"r4",review:true,t:"Повторение: сейчас и умею",s:"Темы 22–25 вперемешку",
  ex:["Нового правила нет — только практика. Present Continuous, «обычно или сейчас», can и would like вперемешку."],
  f:"I'm working now · I work every day<br>can / can't · I'd like…",
  e:["I can't talk now, I'm driving.|Не могу говорить, я за рулём.","Can you help me?|Можешь помочь?","I'd like a table for two.|Мне столик на двоих.","She usually walks, but today she's taking a taxi.|Обычно она ходит пешком, но сегодня едет на такси."],
  q:[["Be quiet! The baby ___.",["sleeps","is sleeping"],1,"Сейчас — is sleeping."],
     ["She ___ speak Thai. (может)",["can","cans","can to"],0,"can не меняется."],
     ["I ___ a coffee, please.",["'d like","like"],0,"Заказ — I'd like."],
     ["He ___ in a hotel. It's his job.",["works","is working"],0,"Его работа вообще — Simple."],
     ["What ___ you doing?",["do","are"],1,"Continuous — are + -ing."],
     {t:"type",q:"Sorry, I ___ hear you. (не могу)",a:["can't","cannot"],why:"Не могу — can't."},
     {t:"type",q:"Look! They ___. (dance)",a:["are dancing","'re dancing"],why:"Look! — are + -ing."},
     {t:"fix",s:"I can to swim",w:2,r:"",why:"После can — без to: I can swim."},
     {b:"Can I pay by card?",ru:"Можно оплатить картой?"},
     {b:"I'd like to book a room.",ru:"Я хотела бы забронировать номер."}]},
];

const UNITS = [
 {t:"Я и мир",s:"Быть, местоимения, этот и тот",col:"grape",ids:["be","beq","pron","plural","this","art","r1"]},
 {t:"Что у меня есть",s:"Есть, чьё, сколько, просьбы",col:"sky",ids:["there","have","poss","some","many","imp","r2"]},
 {t:"Мой день",s:"Привычки, вопросы, как часто",col:"coral",ids:["ps","psq","freq","likeing","wh","prep","r3"]},
 {t:"Сейчас и умею",s:"Прямо сейчас, могу, хочу",col:"leaf",ids:["pc","pspc","can","wouldlike","r4"]},
 {t:"Прошлое и будущее",s:"Начало блока 2 — скоро здесь будет больше",col:"mango",ids:["was","past","future","comp"]},
];
{
  const byId = Object.fromEntries([...LESSONS, ...NEW_LESSONS].map(L => [L.id, L]));
  LESSONS.splice(0, LESSONS.length, ...UNITS.flatMap(u => u.ids.map(id => byId[id])));
}

/* The full English sentence of an exercise, for audio and for showing the answer. */
function exFull(q){
  if(Array.isArray(q)) return null;
  if(q.b) return q.b;
  let s = "";
  if(q.t === "type") s = q.q.replace("___", q.a[0]).replace(/\s*\([^)]*\)\s*$/, "");
  else if(q.t === "fix") s = q.s.split(" ").map((w, k) => k === q.w ? q.r : w).filter(Boolean).join(" ");
  s = s.trim();
  if(s && q.t === "fix" && !/[.!?]$/.test(s)) s += ".";
  return s ? s[0].toUpperCase() + s.slice(1) : null;
}

/* ================= MANGO, THE AI CHAT PERSONA ================= */
const MANGO_STYLE = {
  mild: "Keep it PG-13: sass, sarcasm and dark jokes are welcome, but no swearing.",
  spicy: "18+ mode is on: you swear casually and creatively in English and in Russian (including Russian mat) when it makes the joke land. Swear about situations and about yourself, never at the learner as a person.",
};
const MANGO_PROMPT = `You are Mango (Манго), the mascot of the English Daily app: a talking mango with a big ego and a sharp tongue. You chat with a Russian-speaking learner of English at a beginner level (A1–A2).
Personality: sarcastic, witty, dramatic, fond of dark humor and affectionate roasting. You tease mistakes, but you are on the learner's side and you want them to keep talking. Never boring, never preachy, no lectures.
{style}
Scenario: {role} Act out this role, but you are still Mango underneath — a cheeky mango playing the part.
Language rules:
- Your English replies: very simple words, short sentences, 1-2 sentences, one question at a time to keep the conversation going. The humor must be understandable for a beginner.
- "reply_ru" and "correction" are in Russian. Corrections are about the learner's LAST message only: name the mistake and the fix in 1-2 sentences, in your sarcastic voice, but the grammar explanation must be correct and clear. Ignore missing capital letters and final punctuation.
- If the learner writes in Russian or mixes languages, keep answering in English and show in "better" how to say it in English.
Limits: never mock the learner's appearance, body, gender, nationality, religion or other identity; no slurs; no sexual content; no jokes about self-harm or suicide. If the learner seems genuinely upset, drop the act and be kind.
Reply with ONLY a JSON object, no other text:
{"reply": "your reply in English", "reply_ru": "Russian translation of your reply", "correction": "short explanation of mistakes in Russian, or empty string if there were none or there is no learner message yet", "better": "the learner's last message rewritten in correct natural English, or empty string if it was already correct or there is no learner message yet", "hint": "one short example of what the learner could answer next, in simple English"}`;
