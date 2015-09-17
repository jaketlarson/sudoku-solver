class window.SudokuSolver
  constructor: ->
    @initEnv()
    @buildPuzzleInterface()
    @initListeners()
    @updateSize()

  initEnv: =>
    @solver_path = "http://sudoku-solver-mdl.herokuapp.com/solver/call_solver.php"
    @$puzzle_interface = $('#puzzle-interface')
    @$sudoku_submit_form = $('form#sudoku-submit')
    @$sudoku_reset_button = $('a#puzzle-reset')
    @$error_connection = $('#error-connection')
    @$error_invalid = $('#error-invalid')
    @rows = 9
    @cols = 9
    @xhr_waiting = false

  buildPuzzleInterface: =>
    for i in [1..@rows]
      console.log i
      $row = $('<div />').attr('class', 'puzzle-row')
      for i in [1..@cols]
        $row.append "<input type='text' maxlength='1'>"

      @$puzzle_interface.append $row

  initListeners: =>
    $(window).resize =>
      @updateSize()

    @$sudoku_submit_form.submit (e) =>
      e.preventDefault()
      @submitPuzzle()

    @$sudoku_reset_button.click =>
      @reset()

  updateSize: =>
    width = @$puzzle_interface.find('input').width()
    @$puzzle_interface.find('input').height(width)
    console.log width

  submitPuzzle: =>
    if @xhr_waiting
      return

    console.log 'submitting'

    @hideErrors()
    @disable()

    sequence = []
    $.each @$puzzle_interface.find('input'), (index, elem) =>
      value = parseInt($(elem).val())
      if value >= 1 && value <= 9
        sequence.push value
      else
        sequence.push 0
    
    @xhr_waiting = true
    $.ajax(
      type: 'GET'
      url: "#{@solver_path}?puzzle=#{sequence.join(' ')}"
      success: (data) =>
        @xhr_waiting = false
        @enable()

        if data == "invalid"
          @handleInvalid()
        else
          @handleSuccess data

      error: =>
        @xhr_waiting = false
        @enable()
        @handleConnectionError()
    )

  hideErrors: =>
    @$error_invalid.hide()
    @$error_connection.hide()

  handleInvalid: =>
    @$error_invalid.show()
    @$puzzle_interface.find('input').addClass('error-flash')
    @resetInputAfterFlash()

  handleConnectionError: =>
    @$error_connection.show()

  handleSuccess: (data) =>
    entries = data.split(' ')
    $.each entries, (index, entry) =>
      $(@$puzzle_interface.find('input')[index]).val(entry).addClass('success-flash')

    @resetInputAfterFlash()

  resetInputAfterFlash: =>
    setTimeout(() =>
      @$puzzle_interface.find('input').removeClass('success-flash').removeClass('error-flash')
    , 500)

  disable: =>
    @$puzzle_interface.find('input').prop 'disabled', true
    @$sudoku_submit_form.find('button').prop 'disabled', true
    @$sudoku_reset_button.addClass('mdl-button--disabled')

  enable: =>
    @$puzzle_interface.find('input').prop 'disabled', false
    @$sudoku_submit_form.find('button').prop 'disabled', false
    @$sudoku_reset_button.removeClass('mdl-button--disabled')

  reset: =>
    if !@xhr_waiting
      @$puzzle_interface.find('input').val ''

$ ->
  solver = new window.SudokuSolver