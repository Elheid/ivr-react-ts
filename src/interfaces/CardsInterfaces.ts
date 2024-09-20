
/*
Service

additionIds: ['{"link":"https://storage.yandexcloud.net/akhidov-ivr/icon20.svg"}', '{"link":"https://storage.yandexcloud.net/akhidov-ivr/icon16.1.svg"}'],
categoryId: 2,
description: "{\"description\":\"Оформить постоянную регистрацию может любой совершеннолетний человек.\\nДля оформления регистрации по месту жительства должны присутствовать все собственники старше 14 лет.\\nНеобходимые документы:\\n\\n- Документ, удостоверяющий личность заявителя;\\n\\\\icon0\\n- Письменное согласие собственника или всех собственников (при необходимости);\\n\\\\icon1\\n- Представители несовершеннолетних собственников помещения, должны присутствовать с документами удостоверяющими личность несовершеннолетнего собственника и свидетельством о его рождении.\\n\\\\icon2\\n- По своему усмотрению вы можете предоставить выписку из ЕГРН или свидетельство о государственной регистрации права.\\n\\\\icon3\"}",
iconLinks: ['{"link":"https://storage.yandexcloud.net/akhidov-ivr/icon20.svg"}', '{"link":"https://storage.yandexcloud.net/akhidov-ivr/icon16.1.svg"}', '{"link":"https://storage.yandexcloud.net/akhidov-ivr/icon17.svg"}', '{"link":"https://storage.yandexcloud.net/akhidov-ivr/icon20.svg"}', '{"link":"https://storage.yandexcloud.net/akhidov-ivr/icon16.1.svg"}', '{"link":"https://storage.yandexcloud.net/akhidov-ivr/icon16.2.svg"}'],
links: [{  добавьте сюда данные, если необходимо *}],

*/

/*
Category 

childrenCategoryIds: []
itemsInCategoryIds: (6) [14, 18, 16, 19, 17, 15]
links: [{…}]
parentCategoryId
*/

interface CardTemplate {
    id: number; 
    gifPreview: string;
    mainIconLink: string;
    title: string;
}


interface Category extends CardTemplate {
    itemsInCategoryIds: number[];
    childrenCategoryIds: number[];
    parentCategoryId: number;
    size?: number;
}
interface Service extends CardTemplate  {
    categoryId: number; 
    additionIds: number[];
    description:string;
    gifLink:string;
    iconLinks:string[];
    size?: number;
}

interface InfoCard extends CardTemplate{
    itemId:number;
    description:string;
    gifLink:string;
    iconLinks: number[];
}

export type {Category, Service, CardTemplate, InfoCard};