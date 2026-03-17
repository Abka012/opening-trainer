'use client';

import { Badge } from '@/components/ui/badge';
import { getOpeningsByEco, ecoCategoryDescriptions } from '@/lib/eco-data';

interface OpeningInfoProps {
  eco: string;
  name: string;
  moves?: string;
}

export function OpeningInfo({ eco, name, moves }: OpeningInfoProps) {
  const category = eco.charAt(0);
  const categoryDescription = ecoCategoryDescriptions[category] || '';
  
  // Get related openings with same ECO code
  const relatedOpenings = getOpeningsByEco(eco);

  return (
    <div className="space-y-4">
      {/* Main Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {eco}
          </Badge>
          <span className="text-xs text-muted-foreground">{category} codes</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        {categoryDescription && (
          <p className="text-sm text-muted-foreground">{categoryDescription}</p>
        )}
      </div>

      {/* Move Sequence */}
      {moves && (
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-foreground">Moves</h4>
          <p className="font-mono text-sm text-muted-foreground">{moves}</p>
        </div>
      )}

      {/* Related Lines */}
      {relatedOpenings.length > 1 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Related Lines</h4>
          <ul className="space-y-1">
            {relatedOpenings.slice(0, 5).map((opening, idx) => (
              <li
                key={`${opening.eco}-${idx}`}
                className="text-sm text-muted-foreground"
              >
                <span className="font-mono text-xs">{opening.eco}</span>{' '}
                {opening.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
