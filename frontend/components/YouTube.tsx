interface Video {
  title: string;
  videoId: string;
}

interface YouTubeProps {
  videos: Video[];
}

export default function YouTube({ videos }: YouTubeProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold mb-2">Travel Videos</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((v, i) => (
          <div key={i}>
            <p className="text-xs text-gray-500 mb-1 truncate">{v.title}</p>
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${v.videoId}`}
              title={v.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}