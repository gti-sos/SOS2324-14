//const fs = require('fs');

// const data2 = fs.readFileSync('ufc_dataset_copy.csv', 'utf8');

const ufc_data = [
    "USA\tArman Tsarukyan\tBeneil Dariush\t1.0\t0.0\t8.0\t2.0\t0.0\t0.0\t0.0\t0.0\tLightweight\tKO/TKO Punch\t1.0\t1:04\tUFC Fight Night\t2023-05-05\tArman Tsarukyan\t341234",
    "USA\tJalin Turner\tBobby Green\t1.0\t0.0\t33.0\t15.0\t0.0\t0.0\t0.0\t0.0\tLightweight\tKO/TKO Punches\t1.0\t2:49\tUFC Fight Night\t2023-03-07\tJalin Turner\t534746",
    "Croacia\tDeiveson Figueiredo\tRob Font\t0.0\t0.0\t45.0\t46.0\t4.0\t0.0\t0.0\t0.0\tBantamweight\tU-DEC\t3.0\t5:00\tUFC Fight Night\t2023-10-10\tDeiveson Figueiredo\t2353461",
    "Croacia\tSean Brady\tKelvin Gastelum\t0.0\t0.0\t14.0\t18.0\t5.0\t0.0\t3.0\t0.0\tWelterweight\tSUB Kimura\t3.0\t1:43\tUFC Fight Night\t2023-02-08\tSean Brady\t754354",
    "Francia\tJoaquim Silva\tClay Guida\t0.0\t0.0\t46.0\t43.0\t2.0\t2.0\t2.0\t0.0\tLightweight\tU-DEC\t3.0\t5:00\tUFC Fight Night\t2023-15-05\tJoaquim Silva\t345247",
    "Francia\tDustin Stoltzfus\tPunahele Soriano\t1.0\t0.0\t64.0\t31.0\t4.0\t0.0\t1.0\t0.0\tMiddleweight\tSUB Rear Naked Choke\t2.0\t4:10\tUFC Fight Night\t2023-12-03\tDustin Stoltzfus\t375969",
    "España\tMiesha Tate\tJulia Avila\t0.0\t0.0\t32.0\t3.0\t4.0\t0.0\t1.0\t0.0\tWomen's Bantamweight\tSUB Rear Naked Choke\t3.0\t1:15\tUFC Fight Night\t2023-05-09\tMiesha Tate\t575677",
    "España\tCody Brundage\tZach Reese\t0.0\t0.0\t9.0\t4.0\t1.0\t0.0\t0.0\t1.0\tMiddleweight\tKO/TKO Slam\t1.0\t1:49\tUFC Fight Night\t2023-10-05\tCody Brundage\t908676",
    "UK\tDrakkar Klose\tJoe Solecki\t0.0\t0.0\t2.0\t1.0\t0.0\t1.0\t0.0\t0.0\tLightweight\tKO/TKO Slam\t1.0\t1:41\tUFC Fight Night\t2023-06-11\tDrakkar Klose\t875636",
    "UK\tRodolfo Bellato\tIhor Potieria\t0.0\t1.0\t80.0\t73.0\t1.0\t0.0\t0.0\t0.0\tLight Heavyweight\tKO/TKO Punches\t2.0\t4:17\tUFC Fight Night\t2023-05-05\tRodolfo Bellato\t1297687",
    "UK\tJared Gooden\tWellington Turman\t0.0\t0.0\t53.0\t37.0\t1.0\t1.0\t1.0\t0.0\tWelterweight\tSUB Rear Naked Choke\t2.0\t1:11\tUFC Fight Night\t2023-05-09\tJared Gooden\t4576432"
];
/**
function calcularMediaTiempoPelea(){

    let totalSegundos = 0;

    ufc_data.forEach(linea => {
        const tiempo = linea.split('\t')[14].split(':'); // Obtiene el tiempo de la columna 15 (índice 14)
        const minutos = parseInt(tiempo[0], 10);
        const segundos = parseInt(tiempo[1], 10);
        totalSegundos += minutos * 60 + segundos;
    });

    const mediaSegundos = totalSegundos / data.length;
    const mediaMinutos = Math.floor(mediaSegundos / 60);
    const mediaSegundosFinal = Math.round(mediaSegundos % 60);

    console.log(`La media de tiempo de las peleas del dataset es de ${mediaMinutos} minutos y ${mediaSegundos} segundos.`)
    return{
        mediaMinu:mediaMinutos,
        mediaSeg:mediaSegundosFinal
    };
}*/

// module.exports = {
//     ufc_data: ufc_data
// };

export { ufc_data };