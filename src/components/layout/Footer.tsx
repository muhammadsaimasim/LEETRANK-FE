import { Link } from 'react-router-dom';
import { Github, Code2 } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Code2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-semibold tracking-tight">
                Leet<span className="text-primary">Rank</span>
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              to={ROUTES.LEADERBOARD}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Leaderboard
            </Link>
            <a
              href="https://leetcode.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              LeetCode
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {currentYear} LeetRank. Built for competitive coders.</p>
        </div>
      </div>
    </footer>
  );
}
