const fs = require('fs');

// const data2 = fs.readFileSync('ufc_dataset_copy.csv', 'utf8');

const ufc_data = [
    "Austin Texas USA\tArman Tsarukyan\tBeneil Dariush\t1.0\t0.0\t8.0\t2.0\t0.0\t0.0\t0.0\t0.0\tLightweight\tKO/TKO Punch\t1.0\t1:04\tUFC Fight Night\t2-Dec-23\tArman Tsarukyan",
    "Austin Texas USA\tJalin Turner\tBobby Green\t1.0\t0.0\t33.0\t15.0\t0.0\t0.0\t0.0\t0.0\tLightweight\tKO/TKO Punches\t1.0\t2:49\tUFC Fight Night\t2-Dec-23\tJalin Turner",
    "Austin Texas USA\tDeiveson Figueiredo\tRob Font\t0.0\t0.0\t45.0\t46.0\t4.0\t0.0\t0.0\t0.0\tBantamweight\tU-DEC\t3.0\t5:00\tUFC Fight Night\t2-Dec-23\tDeiveson Figueiredo",
    "Austin Texas USA\tSean Brady\tKelvin Gastelum\t0.0\t0.0\t14.0\t18.0\t5.0\t0.0\t3.0\t0.0\tWelterweight\tSUB Kimura\t3.0\t1:43\tUFC Fight Night\t2-Dec-23\tSean Brady",
    "Austin Texas USA\tJoaquim Silva\tClay Guida\t0.0\t0.0\t46.0\t43.0\t2.0\t2.0\t2.0\t0.0\tLightweight\tU-DEC\t3.0\t5:00\tUFC Fight Night\t2-Dec-23\tJoaquim Silva",
    "Austin Texas USA\tDustin Stoltzfus\tPunahele Soriano\t1.0\t0.0\t64.0\t31.0\t4.0\t0.0\t1.0\t0.0\tMiddleweight\tSUB Rear Naked Choke\t2.0\t4:10\tUFC Fight Night\t2-Dec-23\tDustin Stoltzfus",
    "Austin Texas USA\tMiesha Tate\tJulia Avila\t0.0\t0.0\t32.0\t3.0\t4.0\t0.0\t1.0\t0.0\tWomen's Bantamweight\tSUB Rear Naked Choke\t3.0\t1:15\tUFC Fight Night\t2-Dec-23\tMiesha Tate",
    "Austin Texas USA\tCody Brundage\tZach Reese\t0.0\t0.0\t9.0\t4.0\t1.0\t0.0\t0.0\t1.0\tMiddleweight\tKO/TKO Slam\t1.0\t1:49\tUFC Fight Night\t2-Dec-23\tCody Brundage",
    "Austin Texas USA\tDrakkar Klose\tJoe Solecki\t0.0\t0.0\t2.0\t1.0\t0.0\t1.0\t0.0\t0.0\tLightweight\tKO/TKO Slam\t1.0\t1:41\tUFC Fight Night\t2-Dec-23\tDrakkar Klose",
    "Austin Texas USA\tRodolfo Bellato\tIhor Potieria\t0.0\t1.0\t80.0\t73.0\t1.0\t0.0\t0.0\t0.0\tLight Heavyweight\tKO/TKO Punches\t2.0\t4:17\tUFC Fight Night\t2-Dec-23\tRodolfo Bellato",
    "Austin Texas USA\tJared Gooden\tWellington Turman\t0.0\t0.0\t53.0\t37.0\t1.0\t1.0\t1.0\t0.0\tWelterweight\tSUB Rear Naked Choke\t2.0\t1:11\tUFC Fight Night\t2-Dec-23\tJared Gooden"
];

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
}

module.exports = {
    calcularMediaTiempoPelea: calcularMediaTiempoPelea,
    ufc_data: ufc_data
};