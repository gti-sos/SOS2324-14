const data_VEG = [
    { ranking: 0, country: 'Albania', title: 'DON XHONI - KATILE', published_at: '2022-07-07', channel_title: 'DON XHONI', category_id: 24, trending_date: '22.11.07', view_count: 5130167, comment_count: 3641 },
    { ranking: 1, country: 'Albania', title: 'Dhurata Dora x Elvana Gjata - GAJDE (Official Video)', published_at: '2022-06-30', channel_title: 'Dhurata Dora', category_id: 10, trending_date: '22.11.07', view_count: 8886648, comment_count: 4414 },
    { ranking: 2, country: 'Albania', title: 'KIDA x BUTRINT IMERI - AM/PM', published_at: '2022-07-02', channel_title: 'KIDA', category_id: 10, trending_date: '22.11.07', view_count: 7230818, comment_count: 7518 },
    { ranking: 3, country: 'Albania', title: 'Dafina Zeqiri - Malli', published_at: '2022-07-07', channel_title: 'Dafina Zeqiri', category_id: 10, trending_date: '22.11.07', view_count: 1406078, comment_count: 827 },
    { ranking: 4, country: 'Albania', title: 'Tayna x Azet - Tequila', published_at: '2022-06-30', channel_title: 'Friends Entertainment', category_id: 10, trending_date: '22.11.07', view_count: 6397676, comment_count: 6063 },
    { ranking: 5, country: 'Albania', title: 'GJIKO x FIFI - DJEGI KREJT', published_at: '2022-07-07', channel_title: 'REDBOX Entertainment', category_id: 10, trending_date: '22.11.07', view_count: 1695364, comment_count: 1961 },
    { ranking: 6, country: 'Albania', title: 'Ardian Bujupi x Ledri Vula - GELATO (prod. by Bled)', published_at: '2022-06-30', channel_title: 'OfficialArdianBujupi', category_id: 10, trending_date: '22.11.07', view_count: 3316092, comment_count: 1391 },
    { ranking: 7, country: 'Albania', title: 'Capital T - Dukat (prod. Panda Music)', published_at: '2022-06-29', channel_title: 'Capital T', category_id: 10, trending_date: '22.11.07', view_count: 7110466, comment_count: 1230 },
    { ranking: 8, country: 'Albania', title: 'MatoLale x Jongmen KOKAINA', published_at: '2022-07-05', channel_title: 'MATOLALE', category_id: 10, trending_date: '22.11.07', view_count: 1157204, comment_count: 929 },
    { ranking: 9, country: "España", title: "España campeona del mundo", published_at: "2010-07-11", channel_title: "SEFutbol", category_id: 2, trending_date: "10.07.11", view_count: 514000, comment_count: 3651 }
];

// Función para calcular la media de view_count para un país específico
function calcularMediaViewCount(data, pais) {
    const filasPais = data.filter(item => item.country === pais);
    const valoresViewCount = filasPais.map(item => item.view_count);
    const sumaViewCount = valoresViewCount.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
    const mediaViewCount = sumaViewCount / filasPais.length;
    return mediaViewCount;
}

// País para el que se desea calcular la media
const paisDeseado = 'Albania';

// Calcular la media de view_count para el país deseado
const mediaViewCountPaisDeseado = calcularMediaViewCount(data_VEG, paisDeseado);

//console.log(`La media de view_count para ${paisDeseado} es: ${mediaViewCountPaisDeseado}`);

// module.exports = data;
export { data_VEG };
