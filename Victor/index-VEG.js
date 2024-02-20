const data = [
    { country: 'Albania', title: 'DON XHONI - KATILE', publishedAt: '2022-07-07T22:00:12Z', channelTitle: 'DON XHONI', categoryId: 24, trending_date: '22.11.07', view_count: 5130167, comment_count: 3641 },
    { country: 'Albania', title: 'Dhurata Dora x Elvana Gjata - GAJDE (Official Video)', publishedAt: '2022-06-30T22:00:11Z', channelTitle: 'Dhurata Dora', categoryId: 10, trending_date: '22.11.07', view_count: 8886648, comment_count: 4414 },
    { country: 'Albania', title: 'KIDA x BUTRINT IMERI - AM/PM', publishedAt: '2022-07-02T22:00:11Z', channelTitle: 'KIDA', categoryId: 10, trending_date: '22.11.07', view_count: 7230818, comment_count: 7518 },
    { country: 'Albania', title: 'Dafina Zeqiri - Malli', publishedAt: '2022-07-07T22:00:12Z', channelTitle: 'Dafina Zeqiri', categoryId: 10, trending_date: '22.11.07', view_count: 1406078, comment_count: 827 },
    { country: 'Albania', title: 'Tayna x Azet - Tequila', publishedAt: '2022-06-30T18:00:26Z', channelTitle: 'Friends Entertainment', categoryId: 10, trending_date: '22.11.07', view_count: 6397676, comment_count: 6063 },
    { country: 'Albania', title: 'GJIKO x FIFI - DJEGI KREJT', publishedAt: '2022-07-07T17:45:11Z', channelTitle: 'REDBOX Entertainment', categoryId: 10, trending_date: '22.11.07', view_count: 1695364, comment_count: 1961 },
    { country: 'Albania', title: 'Ardian Bujupi x Ledri Vula - GELATO (prod. by Bled)', publishedAt: '2022-06-30T22:00:11Z', channelTitle: 'OfficialArdianBujupi', categoryId: 10, trending_date: '22.11.07', view_count: 3316092, comment_count: 1391 },
    { country: 'Albania', title: 'Capital T - Dukat (prod. Panda Music)', publishedAt: '2022-06-29T16:00:03Z', channelTitle: 'Capital T', categoryId: 10, trending_date: '22.11.07', view_count: 7110466, comment_count: 1230 },
    { country: 'Albania', title: 'MatoLale x Jongmen KOKAINA', publishedAt: '2022-07-05T16:30:27Z', channelTitle: 'MATOLALE', categoryId: 10, trending_date: '22.11.07', view_count: 1157204, comment_count: 929 }
];

// Función para calcular la media de view_count para un país específico
function calcularMediaViewCount(pais) {
    const filasPais = data.filter(item => item.country === pais);
    const valoresViewCount = filasPais.map(item => item.view_count);
    const sumaViewCount = valoresViewCount.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
    const mediaViewCount = sumaViewCount / filasPais.length;
    return mediaViewCount;
}

// País para el que se desea calcular la media
const paisDeseado = 'Albania';

// Calcular la media de view_count para el país deseado
const mediaViewCountPaisDeseado = calcularMediaViewCount(paisDeseado);

console.log(`La media de view_count para ${paisDeseado} es: ${mediaViewCountPaisDeseado}`);

