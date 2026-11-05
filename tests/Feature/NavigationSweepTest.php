<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use RegexIterator;
use Tests\TestCase;

class NavigationSweepTest extends TestCase
{
    public function test_all_frontend_route_references_resolve_to_registered_routes(): void
    {
        $jsPath = resource_path('js');
        $directory = new RecursiveDirectoryIterator($jsPath);
        $iterator = new RecursiveIteratorIterator($directory);
        $regex = new RegexIterator($iterator, '/\.(jsx|js)$/');

        $referencedRoutes = [];
        $pattern = "/(?:route\(\s*['\"]([a-zA-Z0-9._-]+)['\"])/";

        foreach ($regex as $file) {
            $contents = file_get_contents($file->getPathname());
            if (preg_match_all($pattern, $contents, $matches)) {
                foreach ($matches[1] as $routeName) {
                    $referencedRoutes[$routeName] = $file->getFilename();
                }
            }
        }

        $this->assertNotEmpty($referencedRoutes, 'No route() references found in frontend code.');

        $missingRoutes = [];
        foreach ($referencedRoutes as $routeName => $fileName) {
            if (! Route::has($routeName)) {
                $missingRoutes[] = "{$routeName} (referenced in {$fileName})";
            }
        }

        $this->assertEmpty(
            $missingRoutes,
            "The following frontend route() calls do not exist in Laravel's route collection:\n".implode("\n", $missingRoutes)
        );
    }
}
