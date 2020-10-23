export const objectPropsArrToStr = (object: any) => {
  return Object.keys(object)
    .map((key: string) => (object[key] ? object[key].join('') : ''))
    .join('');
};

export const maskPhoneInput = (value: any) => {
  const x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
  const newValue = !x[2] ? x[1] : `(${x[1]}) ${x[2]}${x[3] ? `-${x[3]}` : ''}`;
  return newValue;
};

export const urltoFile = (url: any, filename: any, mimeType: any) => {
  return fetch(url)
    .then(res => {
      return res.arrayBuffer();
    })
    .then(buf => {
      return new File([buf], filename, { type: mimeType });
    });
};

export const generateYears = (yearFrom: number, yearTo: number, isReversed: boolean = false) => {
  const years = [];
  for (let year = yearFrom; year <= yearTo; year++) {
    years.push(year);
  }
  return isReversed ? years.reverse() : years;
};

export const buildMonthYearStr = (toPresent: boolean, fromMonth: any, fromYear: any, toMonth: any, toYear: any) => {
  const to = toPresent ? 'Present' : `${toMonth}\ ${toYear}`;
  const s = `${fromMonth}\ ${fromYear} - ${to}`;
  return s;
};
export const getParamInUrl = (): { key: string; page: string } => {
  const data = {
    key: '',
    page: '0'
  };
  // console.log(window.location.href);
  const url = new URL(window.location.href);
  const key = url.searchParams.get('key');
  const page = url.searchParams.get('page');
  data.key = key ? key : '';
  data.page = page ? page : '0';
  return data;
};
