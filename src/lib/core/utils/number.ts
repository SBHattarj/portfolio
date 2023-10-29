export function addPlacement(number: number | string) {
    if(typeof number === "string" && parseInt(number).toString() != number) return ""
    const numberstr = number.toString();
    switch (numberstr.at(-2)) {
        case "1":
            return `${number}</sup>th</sup>`;
    }
    switch(numberstr.at(-1)) {
        case "1":
            return `${number}<sup>st</sup>`;
        case "2":
            return `${number}<sup>nd</sup>`;
        case "3":
            return `${number}<sup>rd</sup>`;
        default:
            return `${number}<sup>th</sup>`;
    }
}
