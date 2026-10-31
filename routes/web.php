<?php

use App\Http\Controllers\JoinRequestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\StudentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Projects (browsing open to verified students)
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');

    // Gated actions (require completed profile)
    Route::middleware('profile.complete')->group(function () {
        Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
        Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
        Route::post('/projects/{project}/join', [JoinRequestController::class, 'store'])->name('projects.join');
    });

    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    // Join Request Management (Owner & Applicant)
    Route::get('/projects/{project}/requests', [JoinRequestController::class, 'index'])->name('projects.requests');
    Route::patch('/join-requests/{joinRequest}/accept', [JoinRequestController::class, 'accept'])->name('join-requests.accept');
    Route::patch('/join-requests/{joinRequest}/reject', [JoinRequestController::class, 'reject'])->name('join-requests.reject');
    Route::get('/my-applications', [JoinRequestController::class, 'mine'])->name('applications.index');

    // Peer Student Profiles
    Route::get('/students/{user}', [StudentController::class, 'show'])->name('students.show');

    // Profile settings
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';