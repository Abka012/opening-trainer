'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { ChessboardDisplay } from '@/components/chess/chessboard-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  loadOpenings,
  getRepertoireStats,
  getOpeningsDueForReview,
} from '@/lib/repertoire-store';
import { STARTING_FEN } from '@/lib/chess-utils';
import type { Opening } from '@/lib/types';
import {
  BookOpen,
  Database,
  GraduationCap,
  Plus,
  ArrowRight,
  Target,
  TrendingUp,
  Clock,
  Flame,
} from 'lucide-react';

export default function DashboardPage() {
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    white: 0,
    black: 0,
    practiced: 0,
    accuracy: 0,
  });
  const [dueForReview, setDueForReview] = useState<Opening[]>([]);
  const [recentOpenings, setRecentOpenings] = useState<Opening[]>([]);

  useEffect(() => {
    const loaded = loadOpenings();
    setOpenings(loaded);
    setStats(getRepertoireStats());
    setDueForReview(getOpeningsDueForReview());
    
    // Get recently studied openings
    const recent = [...loaded]
      .filter((o) => o.lastStudied)
      .sort((a, b) => {
        const dateA = a.lastStudied ? new Date(a.lastStudied).getTime() : 0;
        const dateB = b.lastStudied ? new Date(b.lastStudied).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
    setRecentOpenings(recent);
  }, []);

  const quickActions = [
    {
      title: 'Add Opening',
      description: 'Create a new opening in your repertoire',
      icon: Plus,
      href: '/repertoire',
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Browse Openings',
      description: 'Explore the ECO opening database',
      icon: Database,
      href: '/openings',
      color: 'bg-accent/10 text-accent',
    },
    {
      title: 'Start Practice',
      description: 'Test your knowledge with quizzes',
      icon: GraduationCap,
      href: '/practice',
      color: 'bg-chart-3/20 text-chart-3',
    },
    {
      title: 'My Repertoire',
      description: 'View and manage your openings',
      icon: BookOpen,
      href: '/repertoire',
      color: 'bg-chart-4/20 text-chart-4',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto space-y-8 p-4 md:p-6">
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-card p-8 md:p-12">
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Chess Repertoire Manager
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Build, organize, and master your chess opening repertoire with interactive
                training and spaced repetition.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/repertoire">
                    <BookOpen className="h-5 w-5" />
                    Open Repertoire
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link href="/practice">
                    <GraduationCap className="h-5 w-5" />
                    Start Practice
                  </Link>
                </Button>
              </div>
            </div>

            {/* Decorative chess board */}
            <div className="absolute -bottom-20 -right-20 hidden w-72 opacity-20 lg:block">
              <ChessboardDisplay
                position={STARTING_FEN}
                interactive={false}
              />
            </div>
          </section>

          {/* Stats Overview */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Openings</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.white} white, {stats.black} black
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Practice Accuracy</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.accuracy}%</div>
                <Progress value={stats.accuracy} className="mt-2 h-1" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Practiced</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.practiced}</div>
                <p className="text-xs text-muted-foreground">
                  of {stats.total} openings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Due for Review</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dueForReview.length}</div>
                {dueForReview.length > 0 && (
                  <Button asChild variant="link" className="h-auto p-0 text-xs">
                    <Link href="/practice">Practice now</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Card className="h-full transition-colors hover:bg-secondary/50">
                    <CardHeader className="pb-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}
                      >
                        <action.icon className="h-5 w-5" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-base">{action.title}</CardTitle>
                      <CardDescription className="mt-1 text-sm">
                        {action.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Two Column Layout */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Due for Review */}
            <section>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-accent" />
                        Due for Review
                      </CardTitle>
                      <CardDescription>
                        Openings that need practice based on spaced repetition
                      </CardDescription>
                    </div>
                    {dueForReview.length > 0 && (
                      <Button asChild variant="outline" size="sm">
                        <Link href="/practice">
                          Practice All
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {dueForReview.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <Clock className="mx-auto h-12 w-12 opacity-50" />
                      <p className="mt-2">No openings due for review</p>
                      <p className="text-sm">Practice more to build your schedule</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dueForReview.slice(0, 5).map((opening) => (
                        <div
                          key={opening.id}
                          className="flex items-center justify-between rounded-md border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="outline"
                              className={
                                opening.color === 'white'
                                  ? 'bg-foreground/10'
                                  : 'bg-foreground text-background'
                              }
                            >
                              {opening.color === 'white' ? 'W' : 'B'}
                            </Badge>
                            <div>
                              <p className="font-medium">{opening.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {opening.eco} - {opening.moves.length} moves
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {opening.practiceStats.attempts > 0
                              ? `${Math.round(
                                  (opening.practiceStats.correct /
                                    opening.practiceStats.attempts) *
                                    100
                                )}%`
                              : 'New'}
                          </Badge>
                        </div>
                      ))}
                      {dueForReview.length > 5 && (
                        <p className="text-center text-sm text-muted-foreground">
                          +{dueForReview.length - 5} more openings
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Recently Studied */}
            <section>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recently Studied</CardTitle>
                      <CardDescription>Your most recently practiced openings</CardDescription>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/repertoire">
                        View All
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentOpenings.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <BookOpen className="mx-auto h-12 w-12 opacity-50" />
                      <p className="mt-2">No recent activity</p>
                      <p className="text-sm">Start practicing to see your progress</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentOpenings.map((opening) => (
                        <div
                          key={opening.id}
                          className="flex items-center justify-between rounded-md border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="outline"
                              className={
                                opening.color === 'white'
                                  ? 'bg-foreground/10'
                                  : 'bg-foreground text-background'
                              }
                            >
                              {opening.color === 'white' ? 'W' : 'B'}
                            </Badge>
                            <div>
                              <p className="font-medium">{opening.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Last studied:{' '}
                                {opening.lastStudied
                                  ? new Date(opening.lastStudied).toLocaleDateString()
                                  : 'Never'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <p className="font-medium">
                              {opening.practiceStats.attempts > 0
                                ? `${Math.round(
                                    (opening.practiceStats.correct /
                                      opening.practiceStats.attempts) *
                                      100
                                  )}%`
                                : '-'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {opening.practiceStats.attempts} attempts
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Getting Started Guide for new users */}
          {openings.length === 0 && (
            <section>
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>
                    New to Chess Repertoire Manager? Here&apos;s how to begin:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    <li className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        1
                      </span>
                      <div>
                        <p className="font-medium">Browse the Opening Database</p>
                        <p className="text-sm text-muted-foreground">
                          Explore hundreds of chess openings organized by ECO code and add your
                          favorites to your repertoire.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        2
                      </span>
                      <div>
                        <p className="font-medium">Build Your Repertoire</p>
                        <p className="text-sm text-muted-foreground">
                          Add moves, variations, and annotations to customize your opening lines
                          for both white and black.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        3
                      </span>
                      <div>
                        <p className="font-medium">Practice with Spaced Repetition</p>
                        <p className="text-sm text-muted-foreground">
                          Test your knowledge with interactive quizzes. The system tracks your
                          progress and schedules reviews for optimal retention.
                        </p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Chess Repertoire Manager - Build and master your opening repertoire</p>
        </div>
      </footer>
    </div>
  );
}
