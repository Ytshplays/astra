import { newsArticles } from '@/lib/placeholder-data';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function NewsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-1 animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight text-white">Gaming News Feed</h1>
        <p className="text-muted-foreground">
          Your daily source for what's new in the gaming world.
        </p>
      </div>

      <div className="grid gap-8">
        {newsArticles.map((article, index) => (
          <Link
            href={article.url}
            key={article.id}
            className="group block animate-fade-in-up"
            style={{animationDelay: `${index * 0.1}s`}}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="grid grid-cols-1 overflow-hidden rounded-lg border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/50 group-hover:bg-card/80 animated-card md:grid-cols-5">
              <div className="col-span-1 overflow-hidden md:col-span-2">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={article.dataAiHint}
                />
              </div>
              <div className="col-span-1 flex flex-col p-6 md:col-span-3">
                <p className="text-sm text-muted-foreground">
                  {article.source} &middot; {article.date}
                </p>
                <h2 className="mt-2 text-xl font-bold leading-tight text-white transition-colors group-hover:text-primary">
                  {article.title}
                </h2>
                <div className="mt-auto pt-4">
                  <span className="inline-flex items-center font-semibold text-accent transition-colors group-hover:text-accent/80">
                    Read More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
