<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->label('Customer')
                    ->searchable()
                    ->preload()
                    ->required(),
                \Filament\Forms\Components\Select::make('package_id')
                    ->relationship('package', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                \Filament\Forms\Components\Select::make('joki_id')
                    ->relationship('joki', 'name', fn($query) => $query->where('role', 'joki'))
                    ->label('Assigned Joki')
                    ->searchable()
                    ->preload(),
                Textarea::make('description')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('notes')
                    ->columnSpanFull(),
                DatePicker::make('deadline')
                    ->required(),
                TextInput::make('amount')
                    ->required()
                    ->numeric()
                    ->prefix('Rp'),
                \Filament\Forms\Components\Select::make('status')
                    ->options([
                        'pending_payment' => 'Pending Payment',
                        'pending_assignment' => 'Pending Assignment',
                        'in_progress' => 'In Progress',
                        'review' => 'In Review',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ])
                    ->required()
                    ->default('pending_payment'),
                \Filament\Forms\Components\FileUpload::make('payment_proof')
                    ->image()
                    ->directory('payments'),
                \Filament\Forms\Components\Select::make('payment_status')
                    ->options([
                        'pending' => 'Pending',
                        'paid' => 'Paid',
                        'failed' => 'Failed',
                    ])
                    ->required()
                    ->default('pending'),
                \Filament\Forms\Components\FileUpload::make('result_file')
                    ->directory('results')
                    ->downloadable(),
            ]);
    }
}
