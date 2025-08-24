import { useEffect, useState } from 'react';
import { getVenueImages } from '@/lib/venueImages';

export default function TestImages() {
  const [testVenue] = useState("Al noor banquet");
  const [images, setImages] = useState<Array<{ src: string; alt: string }>>([]);

  useEffect(() => {
    const venueImages = getVenueImages(testVenue);
    setImages(venueImages);
    console.log('Venue images:', venueImages);
  }, [testVenue]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test Page</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Testing images for: {testVenue}</h2>
          <pre className="bg-gray-100 p-4 rounded mb-4">
            {JSON.stringify(images, null, 2)}
          </pre>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="space-y-2">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-48 object-cover rounded"
                onError={(e) => {
                  console.error(`Failed to load image: ${image.src}`);
                  e.currentTarget.src = '/default-venue.jpg';
                }}
              />
              <p className="text-sm text-gray-600">Path: {image.src}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
