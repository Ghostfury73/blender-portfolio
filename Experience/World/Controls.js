import * as THREE from "three";
import ASScroll from "@ashthornton/asscroll";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import Experience from "../Experience.js";

export default class Controls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.room = this.experience.world.room.roomModel;
    this.circle = this.experience.world.floor.circle;
    this.room.children.forEach((child) => {
      if (child.type === "RectAreaLight") {
          this.rectLight = child;
      }
  });
  this.circleFirst = this.experience.world.floor.circleFirst;
  this.circleSecond = this.experience.world.floor.circleSecond;
  this.circleThird = this.experience.world.floor.circleThird;

  GSAP.registerPlugin(ScrollTrigger);

  document.querySelector(".page").style.overflow = "visible";

  if (
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
      )
  ) {
      this.setSmoothScroll();
  }
  this.setScrollTrigger();
}

 setupASScroll() {
        // https://github.com/ashthornton/asscroll
        const asscroll = new ASScroll({
            ease: 0.1,
            disableRaf: true,
        });

        GSAP.ticker.add(asscroll.update);

        ScrollTrigger.defaults({
            scroller: asscroll.containerElement,
        });

        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                if (arguments.length) {
                    asscroll.currentPos = value;
                    return;
                }
                return asscroll.currentPos;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            fixedMarkers: true,
        });

        asscroll.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", asscroll.resize);

        requestAnimationFrame(() => {
            asscroll.enable({
                newScrollElements: document.querySelectorAll(
                    ".gsap-marker-start, .gsap-marker-end, [asscroll]"
                ),
            });
        });
        return asscroll;
    }

    setSmoothScroll() {
        this.asscroll = this.setupASScroll();
    }

  setScrollTrigger() {
    ScrollTrigger.matchMedia({
      //Desktop
      "(min-width: 969px)": () => {
          // Reset
          this.room.scale.set(0.5, 0.5, 0.5);
          
          // First section
          this.firstTimeline = new GSAP.timeline({
             scrollTrigger: {
              trigger: ".first",
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }).to(
            this.room.position,
            {
                x: () => {
                    return this.sizes.width * 0.0014;
                },
            }
          );

          // Second section
          this.secondTimeline = new GSAP.timeline({
            scrollTrigger: {
              trigger: ".second",
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
            .to(
              this.room.position,
              {
                x: () => {
                  return -this.sizes.width * 0.0009;
                },
                z: () => {
                  return this.sizes.height * 0.0057;
                },
                
              },
              "same"
            )
            .to(
              this.room.scale,
              {
                x: 1.85,
                y: 1.85,
                z: 1.85,
              },
              "same"
            )
            .to(
              this.rectLight,
              {height: 0.7 * 2,
                  width: 0.9 * 5,
                  
              },
              "same"
          );

          // Third section
          this.thirdTimeline = new GSAP.timeline({
            scrollTrigger: {
              trigger: ".third",
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
         
            .to(
              this.camera.orthographicCamera.position,
              {
                x: -7,
                y: 2,
                z: 13,
             
                
              },
              "sideLeft"
            )
        }, 
        // Mobile
        "(max-width: 968px)": () => {
          // Reset
          this.room.scale.set(0.3, 0.3, 0.3);

          // First section
          this.firstMobileTimeline = new GSAP.timeline({
            scrollTrigger: {
              trigger: ".first",
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }).to(this.room.scale, {
            x: 0.4,
            y: 0.4,
            z: 0.4,
          });

          // Second section
          this.secondMobileTimeline = new GSAP.timeline({
            scrollTrigger: {
              trigger: ".second",
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          
          .to(this.room.scale, {
            x: 1.4,
            y: 1.4,
            z: 1.4,
          })
          .to(
            this.room.position,
            {
              x: () => {
                return -this.sizes.width * 0.0009;
              },
              z: () => {
                return this.sizes.height * 0.0067;
              },
              
            },
            "same"
          )
          
          ;

          // Third section
          this.thirdMobileTimeline = new GSAP.timeline({
            scrollTrigger: {
              trigger: ".third",
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }).to(this.camera.orthographicCamera.position, {
            x: -1.5,
            y: -1,
          });
        },

        // Progress bar
      all: () => {
        this.sections = document.querySelectorAll(".section");
        this.sections.forEach((section) => {
          this.progressWrapper = section.querySelector(".progress-wrapper");
          this.progressBar = section.querySelector(".progress-bar ");

          if (section.classList.contains("right")) {
            GSAP.to(section, {
              borderTopLeftRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: 0.6,
              },
            });

            GSAP.to(section, {
              borderBottomLeftRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: "bottom bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          } else {
            GSAP.to(section, {
              borderTopRightRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: 0.6,
              },
            });

            GSAP.to(section, {
              borderBottomRightRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: "bottom bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          }

          GSAP.from(this.progressBar, {
            scaleY: 0,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              pin: this.progressWrapper,
              pinSpacing: false,
            },
          });
        });

        // All animations
                // First section -----------------------------------------
                this.firstCircle = new GSAP.timeline({
                  scrollTrigger: {
                      trigger: ".first",
                      start: "top top",
                      end: "bottom bottom",
                      scrub: 0.6,
                  },
              }).to(this.circleFirst.scale, {
                  x: 3,
                  y: 3,
                  z: 3,
              });

              // Second section -----------------------------------------
              this.secondCircle = new GSAP.timeline({
                  scrollTrigger: {
                      trigger: ".second",
                      start: "top top",
                      end: "bottom bottom",
                      scrub: 0.6,
                  },
              })
                  .to(
                      this.circleSecond.scale,
                      {
                          x: 6,
                          y: 6,
                          z: 6,
                      },
                      "same"
                  )
                  .to(
                      this.room.position,
                      {
                          y: 0.7,
                      },
                      "same"
                  );

              // Third section -----------------------------------------
              this.thirdCircle = new GSAP.timeline({
                  scrollTrigger: {
                      trigger: ".third",
                      start: "top top",
                      end: "bottom bottom",
                      scrub: 0.6,
                  },
              }).to(this.circleThird.scale, {
                  x: 10,
                  y: 10,
                  z: 10,
              });

        // Mini Platform animation
        this.miniPlatformTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".third",
            start: "center center",
          },
        });

        this.room.children.forEach((child) => {
          if (child.name === "MiniFloor") {
            this.first = GSAP.to(child.position, {
              x: -1.17847,
              z: 2.84269,
              duration: 0.3,
            });
          }

          if (child.name === "Mailbox") {
            this.second = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
              ease: "back.out(2)",
            });
          }
          if (child.name === "ExteriorLamp") {
            this.third = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
              ease: "back.out(2)",
            });
          }
          if (child.name === "Floor1") {
            this.fourth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
              ease: "back.out(2)",
            });
          }
          if (child.name === "Floor2") {
            this.fifth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
              ease: "back.out(2)",
            });
          }
          if (child.name === "Floor3") {
            this.sixth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
              ease: "back.out(2)",
            });
          }
          if (child.name === "FloorStep1") {
            this.seventh = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
              ease: "back.out(2)",
            });
          }
          if (child.name === "FloorStep2") {
            this.heighth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
              ease: "back.out(2)",
            });
          }
        });

        this.miniPlatformTimeline.add(this.first);
        this.miniPlatformTimeline.add(this.second);
        this.miniPlatformTimeline.add(this.third);
        this.miniPlatformTimeline.add(this.fourth, "-=0.2");
        this.miniPlatformTimeline.add(this.fifth, "-=0.2");
        this.miniPlatformTimeline.add(this.sixth, "-=0.2");
        this.miniPlatformTimeline.add(this.seventh, "-=0.1");
        this.miniPlatformTimeline.add(this.heighth, "-=0.1");
      }
  });

    
  }

  resize() {}

  update() {}
}
