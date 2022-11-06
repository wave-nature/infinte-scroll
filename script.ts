import axios, { AxiosPromise, AxiosResponse } from "axios";

interface Data {
  id: string;
  url: string;
  link: string;
}
interface Attributes {}

let images: Data[] = [];
let counter = 30;
let ready = false;
let loadedImages = 0;
let totalImages = 0;

function setAttributes<T>(element: T, attribues: Attributes): void {
  for (const key in attribues) {
    element[key] = attribues[key];
  }
}

function loading(status: boolean): void {
  const loader: HTMLElement | null = document.querySelector(".loader");
  loader["hidden"] = !status;
}

function displayImages(): void {
  loadedImages = 0;
  totalImages = images.length;
  const imageContainer = document.querySelector(".img-container");
  images.forEach((data: Data): void => {
    const link = document.createElement("a");
    setAttributes<HTMLAnchorElement>(link, {
      href: data.link,
      target: "_blank",
    });

    const img = document.createElement("img");
    setAttributes<HTMLImageElement>(img, {
      src: data.url,
      alt: data.id,
      title: data.id,
    });

    img.addEventListener("load", (): void => {
      loadedImages++;
      if (loadedImages === totalImages) {
        ready = true;
      }
    });

    link.appendChild(img);
    imageContainer?.appendChild(link);
  });
}

async function fetchRandomPhotos(): AxiosPromise {
  loading(true);
  const response = await axios(
    `https://api.unsplash.com/photos/random/?client_id=7iJSDP0VTZxnoiBBmDj1qDhDT1U7ZQOuEdcVfN9cies&count=${counter}`
  );
  loading(false);

  return response.data;
}

function infiniteScroll(): void {
  fetchRandomPhotos().then((res: AxiosResponse) => {
    const imgsData: Data[] = res.map(
      (r): Data => ({
        id: r.id,
        url: r.urls.regular,
        link: r.links.html,
      })
    );
    images = imgsData;

    displayImages();
  });
}

infiniteScroll();

window.addEventListener("scroll", (): void => {
  if (
    window.innerHeight + window.scrollY > document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    infiniteScroll();
  }
});
