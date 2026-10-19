import ProjectImage from './ProjectImage'
import BeforeAfter from './BeforeAfter'
import Reveal from './Reveal'

function Caption({ image }) {
  if (!image.caption) return null
  return <figcaption className="mt-3 max-w-prose text-sm text-ink-muted">{image.caption}</figcaption>
}

/**
 * Lays out a project's screenshots by kind. Frames are opt-in for desktop
 * shots ("frame": "browser"); phone screenshots get a device frame by default.
 */
export default function Gallery({ project }) {
  const { images, presentation, title } = project
  const projectFrame = presentation.frame
  const frameFor = (kind) => (projectFrame !== 'auto' ? projectFrame : kind === 'mobile' ? 'device' : 'none')
  const desktop = images.desktop.filter((image) => !image.missing)
  const mobile = images.mobile.filter((image) => !image.missing)
  const gallery = images.gallery.filter((image) => !image.missing)

  return (
    <div className="space-y-20 md:space-y-28">
      {desktop.map((image, index) => (
        <Reveal as="figure" key={image.src} className="page-grid">
          <div className="col-span-full lg:col-span-10 lg:col-start-2">
            <ProjectImage
              image={image}
              alt={`${title}: desktop screen ${index + 1}`}
              frame={frameFor('desktop')}
              className={frameFor('desktop') === 'none' ? 'border border-ink/10' : ''}
              sizes="(min-width: 1024px) 83vw, 100vw"
            />
            <Caption image={image} />
          </div>
        </Reveal>
      ))}

      {mobile.length > 0 && (
        <div className="bg-paper-deep py-16 md:py-24" style={presentation.accent ? { backgroundColor: presentation.accent } : undefined}>
          <ul className="mx-auto flex max-w-page flex-wrap items-start justify-center gap-8 px-gutter md:gap-12">
            {mobile.map((image, index) => (
              <Reveal as="li" key={image.src} delay={index * 100} className="w-[min(78vw,20rem)]">
                <figure>
                  <ProjectImage image={image} alt={`${title}: mobile screen ${index + 1}`} frame={frameFor('mobile')} sizes="320px" />
                  {image.caption && (
                    <figcaption className={`mt-3 text-sm ${presentation.accent ? 'rounded bg-paper/90 px-2 py-1 text-ink' : 'text-ink-muted'}`}>
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      )}

      {gallery.length > 0 && (
        <ul className="page-grid gap-y-12">
          {gallery.map((image, index) => {
            const wide = image.kind === 'full' || image.kind === 'desktop' || !image.kind
            const kind = image.kind ?? 'desktop'
            return (
              <Reveal
                as="li"
                key={image.src}
                className={
                  kind === 'mobile'
                    ? 'col-span-2 md:col-span-3 lg:col-span-3'
                    : wide && gallery.length > 1 && index % 3 === 0
                      ? 'col-span-full'
                      : 'col-span-full md:col-span-4 lg:col-span-6'
                }
              >
                <figure>
                  <ProjectImage
                    image={image}
                    alt={`${title}: screenshot ${index + 1}`}
                    frame={frameFor(kind)}
                    className={frameFor(kind) === 'none' ? 'border border-ink/10' : ''}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  <Caption image={image} />
                </figure>
              </Reveal>
            )
          })}
        </ul>
      )}

      {images.beforeAfter.map((pair, index) => (
        <div key={index} className="page-grid">
          <div className="col-span-full lg:col-span-10 lg:col-start-2">
            <BeforeAfter pair={pair} title={title} />
          </div>
        </div>
      ))}

      {images.video && (
        <figure className="page-grid">
          <div className="col-span-full lg:col-span-10 lg:col-start-2">
            {/* Never autoplays: visitors choose to load the video. */}
            <video
              controls
              preload="none"
              poster={images.video.poster || undefined}
              className="block aspect-video w-full bg-ink"
            >
              <source src={images.video.src} />
            </video>
            {images.video.caption && <figcaption className="mt-3 text-sm text-ink-muted">{images.video.caption}</figcaption>}
          </div>
        </figure>
      )}
    </div>
  )
}

