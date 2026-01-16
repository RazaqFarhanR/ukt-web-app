import Image from 'next/image'
import React, { } from 'react'


//icon

// import jurusSvg from '../components/jurus.svg';

const senamLine = "/svg/icon/senam outline.svg"
const senamFill = "/svg/icon/senam fill.svg"
const senamToyaLine = "/svg/icon/senam toya outline.svg"
const senamToyaFill = "/svg/icon/senam toya fill.svg"
const jurusLine = "/svg/icon/jurus outline.svg"
const jurusToyaLine = "/svg/icon/jurus toya outline.svg"
const jurusToyaFill = "/svg/icon/jurus toya fill.svg"
const jurusFill = "/svg/icon/jurus fill.svg"
const teknikLine = "/svg/icon/teknik outline.svg"
const teknikFill = "/svg/icon/teknik fill.svg"
const fisikLine = "/svg/icon/fisik outline.svg"
const fisikFill = "/svg/icon/fisik fill.svg"
const srcSambungline = "/svg/icon/sambung outline.svg"
const srcSambungfill = "/svg/icon/sambung fill.svg"
const belatiLine = "/svg/icon/belati outline.svg"
const belatiFill = "/svg/icon/belati fill.svg"
const kripenLine = "/svg/icon/kripen outline.svg"
const kripenFill = "/svg/icon/kripen fill.svg"
const navLinks1 = [
  {
    links: [
      { label: "senam", link: "senam", icon: <img src={senamLine}></img>, icon2: <img src={senamFill}></img> },
      { label: "jurus", link: "jurus", icon: <img src={jurusLine}></img>, icon2: <img src={jurusFill}></img> },
      { label: "fisik", link: "fisik", icon: <img src={fisikLine}></img>, icon2: <img src={fisikFill}></img> },
      { label: "teknik", link: "teknik", icon: <img src={teknikLine}></img>, icon2: <img src={teknikFill}></img> },
      { label: "sambung", link: "sambung", icon: <img src={srcSambungline}></img>, icon2: <img src={srcSambungfill}></img> },
    ]
  }
];

<Image src="/svg/spinner.svg" className="rounded-md" width={78} height={78} alt="Your SVG" />
const navLinks2 = [
  {
    links: [
      { label: "senam", link: "senam", icon: <img src={senamLine}></img>, icon2: <img src={senamFill}></img> },
      { label: "senam toya", link: "senam_toya", icon: <img src={senamToyaLine}></img>, icon2: <img src={senamToyaFill}></img> },
      { label: "jurus", link: "jurus", icon: <img src={jurusLine}></img>, icon2: <img src={jurusFill}></img> },
      { label: "jurus toya", link: "jurus_toya", icon: <img src={jurusToyaLine}></img>, icon2: <img src={jurusToyaFill}></img> },
      { label: "fisik", link: "fisik", icon: <img src={fisikLine}></img>, icon2: <img src={fisikFill}></img> },
      { label: "teknik", link: "teknik", icon: <img src={teknikLine}></img>, icon2: <img src={teknikFill}></img> },
      { label: "belati", link: "belati", icon: <img src={belatiLine} className="rounded-md" width={78} height={78} alt="Your SVG" />, icon2: <img src={belatiFill} className="rounded-md" width={78} height={78} alt="Your SVG" /> },
      { label: "kripen", link: "kripen", icon: <img src={kripenLine}></img>, icon2: <img src={kripenFill}></img> },
      { label: "sambung", link: "sambung", icon: <img src={srcSambungline}></img>, icon2: <img src={srcSambungfill}></img> },
    ]
  }
];

function MainNavigation(props) {
  const { active, setActive, tipeUkt } = props;
  const dataEvent = tipeUkt
  const data = dataEvent == "UKCW"
    ? navLinks2 : dataEvent == "UKT PUTIH"
      ? navLinks2 : navLinks1
  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };
  return (
    <header className="sticky z-10 w-full bg-white h-auto flex flex-col mx-auto shadow-md">
      {data.map((navItem, navIndex) => {
        const rows = chunkArray(navItem.links, 7);

        return (
          <nav key={navIndex} className="w-full">
            {rows.map((row, rowIndex) => (
              <ul key={rowIndex} className="flex gap-6 justify-center">
                {row.map((link, index) => (
                  <li
                    key={index}
                    onClick={() => setActive(link.link)}
                  >
                    <div className="flex flex-col px-1 pt-4 py-2 w-12 items-center justify-center capitalize">
                      <div
                        style={{
                          background:
                            active === link.link ? "#d4d5d6" : "#ffffff",
                        }}
                        className="flex rounded-full items-center justify-center transition-all duration-200 ease-linear"
                      >
                        <div className="p-2">
                          <div
                            className={
                              active === link.link
                                ? "text-black text-xl rounded-full"
                                : "text-gray text-xl rounded-full"
                            }
                          >
                            {active === link.link
                              ? link.icon2
                              : link.icon}
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          active === link.link
                            ? "text-sm text-center text-black"
                            : "text-sm text-center text-gray"
                        }
                      >
                        {link.label}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </nav>
        );
      })}
    </header>

  );
}

export default MainNavigation;